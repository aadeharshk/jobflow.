import { describe, expect, it } from "vitest";
import { env } from "cloudflare:workers";
import { api, pdfBytes, signIn } from "./helpers";

describe("profile", () => {
  it("returns and updates the current user with validation", async () => {
    const { cookie } = await signIn();
    const ok = await api("/api/me", { method: "PATCH", cookie, json: { name: "Harsh", country: "IN", timezone: "Asia/Kolkata" } });
    expect(ok.status).toBe(200);
    expect(((await ok.json()) as { user: Record<string, unknown> }).user).toMatchObject({
      name: "Harsh",
      country: "IN",
      timezone: "Asia/Kolkata",
    });
    expect((await api("/api/me", { method: "PATCH", cookie, json: { country: "India" } })).status).toBe(400);
    expect((await api("/api/me", { method: "PATCH", cookie, json: { timezone: "Mars/Olympus" } })).status).toBe(400);
    expect((await api("/api/me", { method: "PATCH", cookie, json: { role: "admin" } })).status).toBe(400);
  });

  it("requires authentication", async () => {
    expect((await api("/api/me")).status).toBe(401);
    expect((await api("/api/me/export")).status).toBe(401);
  });
});

describe("session management", () => {
  it("lists sessions and revokes others", async () => {
    const email = `multi.${crypto.randomUUID()}@example.com`;
    const a = await signIn(email);
    const b = await signIn(email);
    const list = (await (await api("/api/me/sessions", { cookie: a.cookie })).json()) as { sessions: { id: string; current: boolean }[] };
    expect(list.sessions).toHaveLength(2);
    expect(list.sessions.filter((s) => s.current)).toHaveLength(1);
    expect((await api("/api/me/sessions/revoke-others", { method: "POST", cookie: a.cookie })).status).toBe(200);
    expect((await api("/api/me", { cookie: b.cookie })).status).toBe(401);
    expect((await api("/api/me", { cookie: a.cookie })).status).toBe(200);
  });

  it("revokes a single session by handle and ignores other users' handles", async () => {
    const owner = await signIn();
    const other = await signIn();
    const list = (await (await api("/api/me/sessions", { cookie: other.cookie })).json()) as { sessions: { id: string }[] };
    const res = await api(`/api/me/sessions/${list.sessions[0]!.id}`, { method: "DELETE", cookie: owner.cookie });
    expect(res.status).toBe(404);
    expect((await api("/api/me", { cookie: other.cookie })).status).toBe(200);
  });
});

describe("automation controls", () => {
  it("pauses sending and syncs the Durable Object", async () => {
    const { cookie } = await signIn();
    const res = await api("/api/me/automation", { method: "PATCH", cookie, json: { paused: true, dailyCap: 5 } });
    expect(res.status).toBe(200);
    const status = (await (await api("/api/me/automation", { cookie })).json()) as {
      settings: { paused: boolean; dailyCap: number };
      sending: { paused: boolean; dailyCap: number; remaining: number };
      platformDailyCap: number;
    };
    expect(status.settings).toMatchObject({ paused: true, dailyCap: 5 });
    expect(status.sending).toMatchObject({ paused: true, dailyCap: 5, remaining: 5 });
    expect(status.platformDailyCap).toBe(20);
  });

  it("rejects caps above the platform maximum", async () => {
    const { cookie } = await signIn();
    expect((await api("/api/me/automation", { method: "PATCH", cookie, json: { dailyCap: 21 } })).status).toBe(400);
  });
});

describe("data export & account deletion", () => {
  it("exports user data without secrets", async () => {
    const { cookie } = await signIn();
    const res = await api("/api/me/export", { cookie });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toMatch(/attachment; filename="jobflow-export-/);
    const text = await res.text();
    expect(text).not.toMatch(/refresh_token|wrapped/i);
    expect(JSON.parse(text)).toHaveProperty("user.email");
  });

  it("deletes the account, its files and sessions after email confirmation", async () => {
    const { cookie, user } = await signIn();
    const form = new FormData();
    form.append("file", new File([pdfBytes()], "cv.pdf", { type: "application/pdf" }));
    expect((await api("/api/files/resumes", { method: "POST", cookie, body: form })).status).toBe(201);

    expect((await api("/api/me", { method: "DELETE", cookie, json: { confirmEmail: "wrong@example.com" } })).status).toBe(400);
    const res = await api("/api/me", { method: "DELETE", cookie, json: { confirmEmail: user.email.toUpperCase() } });
    expect(res.status).toBe(200);

    expect(await env.DB_CORE.prepare("SELECT id FROM users WHERE id = ?").bind(user.id).first()).toBeNull();
    expect(
      (await env.DB_CORE.prepare("SELECT COUNT(*) AS n FROM sessions WHERE user_id = ?").bind(user.id).first<{ n: number }>())?.n,
    ).toBe(0);
    expect((await env.DB_CORE.prepare("SELECT COUNT(*) AS n FROM files WHERE user_id = ?").bind(user.id).first<{ n: number }>())?.n).toBe(
      0,
    );
    expect((await env.FILES.list({ prefix: `users/${user.id}/` })).objects).toHaveLength(0);
    const audit = await env.DB_CORE.prepare(
      "SELECT user_id FROM audit_log WHERE action = 'account.deleted' ORDER BY created_at DESC LIMIT 1",
    ).first<{ user_id: string | null }>();
    expect(audit).toEqual({ user_id: null }); // audit survives, de-identified
    expect((await api("/api/me", { cookie })).status).toBe(401);
  });
});
