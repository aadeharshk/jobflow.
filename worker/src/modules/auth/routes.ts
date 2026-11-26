import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Google, generateCodeVerifier, generateState, decodeIdToken, OAuth2RequestError } from "arctic";
import type { AppEnv } from "../../types";
import { createSession, invalidateSession, clearSessionCookie } from "./sessions";
import { upsertUserFromIdentity } from "./users-repo";
import { audit, trackEvent } from "../../lib/audit";
import { HttpError, notFound } from "../../lib/errors";
import { timingSafeEqual } from "../../lib/crypto";
import { publicUser } from "../users/serialize";

/** Sign-in scopes only. Gmail scopes are requested incrementally in a later phase. */
export const SIGN_IN_SCOPES = ["openid", "email", "profile"] as const;
const OAUTH_COOKIE_TTL_S = 10 * 60;

const googleClaims = z.object({
  sub: z.string().min(1),
  email: z.email(),
  email_verified: z.boolean(),
  name: z.string().optional(),
  picture: z.url().optional(),
});

/** Only same-origin relative paths are accepted as post-login redirects (prevents open redirects). */
export function safeReturnTo(value: string | undefined | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/app";
  return value.slice(0, 512);
}

function googleClient(c: { get: (k: "config") => AppEnv["Variables"]["config"] }) {
  const config = c.get("config");
  if (!config.googleClientId || !config.googleClientSecret) {
    throw new HttpError(503, "google_not_configured", "Google sign-in is not configured on this deployment.");
  }
  return new Google(config.googleClientId, config.googleClientSecret, new URL("/api/auth/google/callback", config.appUrl).toString());
}

export const authRoutes = new Hono<AppEnv>()
  .get("/session", (c) => {
    const user = c.get("user");
    return c.json({ user: user ? publicUser(user) : null });
  })

  .get("/providers", (c) => {
    const config = c.get("config");
    return c.json({
      google: Boolean(config.googleClientId && config.googleClientSecret),
      devLogin: config.devLogin && (config.environment === "development" || config.environment === "test"),
    });
  })

  .get("/google", (c) => {
    const google = googleClient(c);
    const { secureCookies } = c.get("config");
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [...SIGN_IN_SCOPES]);
    url.searchParams.set("prompt", "select_account");
    const opts = { httpOnly: true, secure: secureCookies, sameSite: "Lax" as const, path: "/api/auth", maxAge: OAUTH_COOKIE_TTL_S };
    setCookie(c, "jf_oauth_state", state, opts);
    setCookie(c, "jf_oauth_verifier", codeVerifier, opts);
    setCookie(c, "jf_oauth_return", safeReturnTo(c.req.query("returnTo")), opts);
    return c.redirect(url.toString(), 302);
  })

  .get("/google/callback", async (c) => {
    const google = googleClient(c);
    const { secureCookies } = c.get("config");
    const code = c.req.query("code");
    const state = c.req.query("state");
    const storedState = getCookie(c, "jf_oauth_state");
    const verifier = getCookie(c, "jf_oauth_verifier");
    const returnTo = safeReturnTo(getCookie(c, "jf_oauth_return"));
    for (const name of ["jf_oauth_state", "jf_oauth_verifier", "jf_oauth_return"]) {
      deleteCookie(c, name, { path: "/api/auth", secure: secureCookies });
    }
    if (c.req.query("error")) return c.redirect("/signin?error=access_denied", 302);
    if (!code || !state || !storedState || !verifier || !timingSafeEqual(state, storedState)) {
      return c.redirect("/signin?error=invalid_state", 302);
    }
    let claims: z.infer<typeof googleClaims>;
    try {
      const tokens = await google.validateAuthorizationCode(code, verifier);
      // The ID token comes straight from Google's token endpoint over TLS (OIDC Core §3.1.3.7).
      claims = googleClaims.parse(decodeIdToken(tokens.idToken()));
    } catch (err) {
      console.warn("google_oauth_failed", err instanceof OAuth2RequestError ? err.code : String(err));
      return c.redirect("/signin?error=oauth_failed", 302);
    }
    if (!claims.email_verified) return c.redirect("/signin?error=email_unverified", 302);

    const { user } = await upsertUserFromIdentity(c.env, {
      provider: "google",
      providerUserId: claims.sub,
      email: claims.email,
      emailVerified: claims.email_verified,
      name: claims.name ?? null,
      avatarUrl: claims.picture ?? null,
    });
    await createSession(c, user.id);
    await audit(c.env.DB_CORE, { userId: user.id, action: "session.created", metadata: { provider: "google" } });
    await trackEvent(c.env.DB_CORE, user.id, "signed_in", { provider: "google" });
    return c.redirect(returnTo, 302);
  })

  // Local development / automated tests only. Hard-disabled outside development and test.
  .post("/dev-login", zValidator("json", z.object({ email: z.email(), name: z.string().trim().min(1).max(100).optional() })), async (c) => {
    const config = c.get("config");
    if (!config.devLogin || (config.environment !== "development" && config.environment !== "test")) throw notFound("Route");
    const body = c.req.valid("json");
    const { user } = await upsertUserFromIdentity(c.env, {
      provider: "dev",
      providerUserId: body.email,
      email: body.email,
      emailVerified: true,
      name: body.name ?? null,
    });
    await createSession(c, user.id);
    await audit(c.env.DB_CORE, { userId: user.id, action: "session.created", metadata: { provider: "dev" } });
    return c.json({ user: publicUser(user) });
  })

  .post("/logout", async (c) => {
    const session = c.get("session");
    if (session) {
      await invalidateSession(c.env, session.id);
      await audit(c.env.DB_CORE, { userId: session.userId, action: "session.revoked", target: "current" });
    }
    clearSessionCookie(c);
    return c.json({ ok: true });
  });
