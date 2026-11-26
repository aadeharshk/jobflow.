import { describe, expect, it } from "vitest";
import { env } from "cloudflare:workers";
import { api, cookieFrom, signIn, uniqueEmail } from "./helpers";
import { safeReturnTo } from "../src/modules/auth/routes";

describe("health & basics", () => {
  it("reports healthy bindings with security headers", async () => {
    const res = await api("/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", environment: "test", checks: { dbCore: true, dbJobs: true } });
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("content-security-policy")).toContain("default-src 'none'");
  });

  it("returns JSON 404 for unknown API routes", async () => {
    const res = await api("/api/nope");
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ error: { code: "not_found" } });
  });
});

describe("sessions", () => {
  it("dev login creates a user, session cookie and default automation settings", async () => {
    const email = uniqueEmail("dev");
    const res = await api("/api/auth/dev-login", { method: "POST", json: { email, name: "Asha" } });
    expect(res.status).toBe(200);
    const setCookie = res.headers.getSetCookie().join("\n");
    expect(setCookie).toMatch(/jobflow_session=/);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Lax/i);
    const { user } = (await res.json()) as { user: { id: string } };
    const settings = await env.DB_CORE.prepare("SELECT paused, daily_cap FROM automation_settings WHERE user_id = ?").bind(user.id).first();
    expect(settings).toEqual({ paused: 0, daily_cap: 20 });
    const ev = await env.DB_CORE.prepare("SELECT COUNT(*) AS n FROM events WHERE user_id = ? AND name = 'signed_up'")
      .bind(user.id)
      .first<{ n: number }>();
    expect(ev?.n).toBe(1);
  });

  it("stores only a hash of the session token", async () => {
    const { cookie, user } = await signIn();
    const token = cookie.split("=")[1]!;
    const rows = await env.DB_CORE.prepare("SELECT id FROM sessions WHERE user_id = ?").bind(user.id).all<{ id: string }>();
    expect(rows.results).toHaveLength(1);
    expect(rows.results[0]!.id).not.toBe(token);
    expect(rows.results[0]!.id).toMatch(/^[0-9a-f]{64}$/);
  });

  it("resolves the session and logs out", async () => {
    const { cookie, user } = await signIn();
    const session = await api("/api/auth/session", { cookie });
    expect(((await session.json()) as { user: { id: string } }).user.id).toBe(user.id);
    const out = await api("/api/auth/logout", { method: "POST", cookie });
    expect(out.status).toBe(200);
    const after = await api("/api/me", { cookie });
    expect(after.status).toBe(401);
  });

  it("rejects forged session cookies", async () => {
    const res = await api("/api/me", { cookie: "jobflow_session=forged-token" });
    expect(res.status).toBe(401);
  });

  it("expired sessions are rejected", async () => {
    const { cookie, user } = await signIn();
    await env.DB_CORE.prepare("UPDATE sessions SET expires_at = 1 WHERE user_id = ?").bind(user.id).run();
    expect((await api("/api/me", { cookie })).status).toBe(401);
  });
});

describe("CSRF origin check", () => {
  it("blocks state-changing requests from foreign origins", async () => {
    const res = await api("/api/auth/dev-login", { method: "POST", json: { email: uniqueEmail() }, origin: "https://evil.example" });
    expect(res.status).toBe(403);
  });
  it("blocks state-changing requests without Origin or same-origin fetch metadata", async () => {
    const res = await api("/api/auth/dev-login", { method: "POST", json: { email: uniqueEmail() }, origin: null });
    expect(res.status).toBe(403);
  });
  it("accepts same-origin fetch metadata when Origin is absent", async () => {
    const res = await api("/api/auth/dev-login", {
      method: "POST",
      json: { email: uniqueEmail() },
      origin: null,
      headers: { "Sec-Fetch-Site": "same-origin" },
    });
    expect(res.status).toBe(200);
  });
});

describe("Google OAuth", () => {
  it("redirects to Google with PKCE, state and sign-in scopes only", async () => {
    const res = await api("/api/auth/google?returnTo=/app/settings");
    expect(res.status).toBe(302);
    const url = new URL(res.headers.get("location")!);
    expect(url.origin + url.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(url.searchParams.get("scope")).toBe("openid email profile");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("redirect_uri")).toBe("http://localhost/api/auth/google/callback");
    expect(url.searchParams.get("scope")).not.toContain("gmail");
    const state = cookieFrom(res, "jf_oauth_state");
    expect(state?.split("=")[1]).toBe(url.searchParams.get("state"));
    expect(cookieFrom(res, "jf_oauth_verifier")).toBeTruthy();
  });

  it("rejects callbacks with a mismatched state", async () => {
    const res = await api("/api/auth/google/callback?code=abc&state=wrong", { cookie: "jf_oauth_state=right; jf_oauth_verifier=v" });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/signin?error=invalid_state");
  });

  it("handles the user denying consent", async () => {
    const res = await api("/api/auth/google/callback?error=access_denied&state=s", { cookie: "jf_oauth_state=s; jf_oauth_verifier=v" });
    expect(res.headers.get("location")).toBe("/signin?error=access_denied");
  });

  it("only allows safe relative return paths (no open redirect)", () => {
    expect(safeReturnTo("/app/settings")).toBe("/app/settings");
    expect(safeReturnTo("https://evil.example")).toBe("/app");
    expect(safeReturnTo("//evil.example")).toBe("/app");
    expect(safeReturnTo("/\\evil.example")).toBe("/app");
    expect(safeReturnTo(undefined)).toBe("/app");
  });

  it("advertises available providers", async () => {
    const res = await api("/api/auth/providers");
    expect(await res.json()).toEqual({ google: true, devLogin: true });
  });
});
