import { and, eq, gt, lt, ne } from "drizzle-orm";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";
import { coreDb, core } from "../../db/client";
import { randomToken, sha256Hex } from "../../lib/crypto";
import type { AppEnv, SessionInfo } from "../../types";
import type { User } from "../../db/schema-core";

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RENEW_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000;
const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

export function sessionCookieName(secure: boolean): string {
  // __Host- prefix: Secure, Path=/, no Domain — prevents subdomain cookie injection.
  return secure ? "__Host-jobflow_session" : "jobflow_session";
}

/** Creates a session. Only the SHA-256 of the token is stored; the token itself goes to the cookie. */
export async function createSession(c: Context<AppEnv>, userId: string): Promise<SessionInfo> {
  const token = randomToken();
  const id = await sha256Hex(token);
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  await coreDb(c.env)
    .insert(core.sessions)
    .values({
      id,
      userId,
      createdAt: now,
      expiresAt,
      lastSeenAt: now,
      userAgent: c.req.header("user-agent")?.slice(0, 256) ?? null,
      country: c.req.header("cf-ipcountry") ?? null,
    });
  writeSessionCookie(c, token, expiresAt);
  return { id, userId, expiresAt };
}

function writeSessionCookie(c: Context<AppEnv>, token: string, expiresAt: number) {
  const { secureCookies } = c.get("config");
  setCookie(c, sessionCookieName(secureCookies), token, {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "Lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export function clearSessionCookie(c: Context<AppEnv>) {
  const { secureCookies } = c.get("config");
  deleteCookie(c, sessionCookieName(secureCookies), { path: "/", secure: secureCookies });
}

/** Resolves the session from the cookie; renews sliding expiry; returns null when invalid. */
export async function validateSession(c: Context<AppEnv>): Promise<{ session: SessionInfo; user: User } | null> {
  const { secureCookies } = c.get("config");
  const token = getCookie(c, sessionCookieName(secureCookies));
  if (!token || token.length > 128) return null;
  const id = await sha256Hex(token);
  const db = coreDb(c.env);
  const now = Date.now();
  const rows = await db
    .select({ session: core.sessions, user: core.users })
    .from(core.sessions)
    .innerJoin(core.users, eq(core.users.id, core.sessions.userId))
    .where(and(eq(core.sessions.id, id), gt(core.sessions.expiresAt, now)))
    .limit(1);
  const row = rows[0];
  if (!row) {
    clearSessionCookie(c);
    return null;
  }
  let expiresAt = row.session.expiresAt;
  const needsRenewal = expiresAt - now < RENEW_THRESHOLD_MS;
  if (needsRenewal || now - row.session.lastSeenAt > TOUCH_INTERVAL_MS) {
    if (needsRenewal) expiresAt = now + SESSION_TTL_MS;
    await db.update(core.sessions).set({ lastSeenAt: now, expiresAt }).where(eq(core.sessions.id, id));
    if (needsRenewal) writeSessionCookie(c, token, expiresAt);
  }
  return { session: { id, userId: row.user.id, expiresAt }, user: row.user };
}

export async function invalidateSession(env: AppEnv["Bindings"], sessionId: string) {
  await coreDb(env).delete(core.sessions).where(eq(core.sessions.id, sessionId));
}

export async function invalidateOtherSessions(env: AppEnv["Bindings"], userId: string, keepSessionId: string) {
  await coreDb(env)
    .delete(core.sessions)
    .where(and(eq(core.sessions.userId, userId), ne(core.sessions.id, keepSessionId)));
}

export async function deleteExpiredSessions(env: AppEnv["Bindings"]): Promise<void> {
  await coreDb(env).delete(core.sessions).where(lt(core.sessions.expiresAt, Date.now()));
}
