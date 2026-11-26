import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import type { AppEnv } from "../../types";
import { coreDb, core } from "../../db/client";
import { publicUser } from "./serialize";
import { audit, trackEvent } from "../../lib/audit";
import { notFound, badRequest } from "../../lib/errors";
import { invalidateOtherSessions, clearSessionCookie } from "../auth/sessions";
import { governorFor } from "../governor/client";
import { PLATFORM_DAILY_CAP } from "../governor/policy";

const isTimezone = (tz: string) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

const profilePatch = z
  .object({
    name: z.string().trim().min(1).max(100).nullable(),
    country: z
      .string()
      .regex(/^[A-Z]{2}$/, "ISO 3166-1 alpha-2 code, e.g. IN")
      .nullable(),
    timezone: z.string().max(64).refine(isTimezone, "Unknown IANA time zone").nullable(),
  })
  .partial()
  .strict();

const automationPatch = z
  .object({
    paused: z.boolean(),
    followupsEnabled: z.boolean(),
    dailyCap: z.number().int().min(0).max(PLATFORM_DAILY_CAP),
  })
  .partial()
  .strict();

async function getAutomation(env: AppEnv["Bindings"], userId: string) {
  const db = coreDb(env);
  const rows = await db.select().from(core.automationSettings).where(eq(core.automationSettings.userId, userId)).limit(1);
  if (rows[0]) return rows[0];
  const [row] = await db.insert(core.automationSettings).values({ userId, updatedAt: Date.now() }).returning();
  return row!;
}

export const userRoutes = new Hono<AppEnv>()
  .get("/", (c) => c.json({ user: publicUser(c.get("user")!) }))

  .patch("/", zValidator("json", profilePatch), async (c) => {
    const user = c.get("user")!;
    const patch = c.req.valid("json");
    if (Object.keys(patch).length === 0) throw badRequest("Nothing to update.");
    const [updated] = await coreDb(c.env)
      .update(core.users)
      .set({ ...patch, updatedAt: Date.now() })
      .where(eq(core.users.id, user.id))
      .returning();
    return c.json({ user: publicUser(updated!) });
  })

  .get("/sessions", async (c) => {
    const user = c.get("user")!;
    const current = c.get("session")!;
    const rows = await coreDb(c.env)
      .select()
      .from(core.sessions)
      .where(eq(core.sessions.userId, user.id))
      .orderBy(desc(core.sessions.lastSeenAt));
    return c.json({
      sessions: rows.map((s) => ({
        // Expose a short opaque handle, never the session ID hash itself in full.
        id: s.id.slice(0, 16),
        current: s.id === current.id,
        createdAt: s.createdAt,
        lastSeenAt: s.lastSeenAt,
        expiresAt: s.expiresAt,
        userAgent: s.userAgent,
        country: s.country,
      })),
    });
  })

  .delete("/sessions/:handle", async (c) => {
    const user = c.get("user")!;
    const handle = c.req.param("handle");
    if (!/^[0-9a-f]{16}$/.test(handle)) throw notFound("Session");
    const db = coreDb(c.env);
    const rows = await db.select({ id: core.sessions.id }).from(core.sessions).where(eq(core.sessions.userId, user.id));
    const match = rows.find((r) => r.id.startsWith(handle));
    if (!match) throw notFound("Session");
    await db.delete(core.sessions).where(and(eq(core.sessions.id, match.id), eq(core.sessions.userId, user.id)));
    if (match.id === c.get("session")!.id) clearSessionCookie(c);
    await audit(c.env.DB_CORE, { userId: user.id, action: "session.revoked", target: handle });
    return c.json({ ok: true });
  })

  .post("/sessions/revoke-others", async (c) => {
    const user = c.get("user")!;
    await invalidateOtherSessions(c.env, user.id, c.get("session")!.id);
    await audit(c.env.DB_CORE, { userId: user.id, action: "session.revoked", target: "others" });
    return c.json({ ok: true });
  })

  .get("/automation", async (c) => {
    const user = c.get("user")!;
    const settings = await getAutomation(c.env, user.id);
    const status = await governorFor(c.env, user.id).status();
    return c.json({
      settings: { paused: settings.paused, followupsEnabled: settings.followupsEnabled, dailyCap: settings.dailyCap },
      sending: status,
      platformDailyCap: PLATFORM_DAILY_CAP,
    });
  })

  .patch("/automation", zValidator("json", automationPatch), async (c) => {
    const user = c.get("user")!;
    const patch = c.req.valid("json");
    if (Object.keys(patch).length === 0) throw badRequest("Nothing to update.");
    await getAutomation(c.env, user.id);
    const [updated] = await coreDb(c.env)
      .update(core.automationSettings)
      .set({ ...patch, updatedAt: Date.now() })
      .where(eq(core.automationSettings.userId, user.id))
      .returning();
    // The Durable Object is the enforcement point; D1 is the durable record shown in the UI.
    await governorFor(c.env, user.id).configure({ paused: updated!.paused, dailyCap: updated!.dailyCap });
    await audit(c.env.DB_CORE, { userId: user.id, action: "automation.updated", metadata: patch });
    if (patch.paused !== undefined) await trackEvent(c.env.DB_CORE, user.id, patch.paused ? "automation_paused" : "automation_resumed");
    return c.json({ settings: { paused: updated!.paused, followupsEnabled: updated!.followupsEnabled, dailyCap: updated!.dailyCap } });
  })

  .get("/activity", async (c) => {
    const user = c.get("user")!;
    const rows = await coreDb(c.env)
      .select({ name: core.events.name, props: core.events.props, createdAt: core.events.createdAt })
      .from(core.events)
      .where(eq(core.events.userId, user.id))
      .orderBy(desc(core.events.createdAt))
      .limit(50);
    return c.json({ events: rows.map((r) => ({ ...r, props: r.props ? JSON.parse(r.props) : null })) });
  })

  // GDPR/DPDP-style data portability: everything JobFlow stores about the user (no secrets).
  .get("/export", async (c) => {
    const user = c.get("user")!;
    const db = coreDb(c.env);
    const [files, settings, events, sessions, accounts] = await Promise.all([
      db.select().from(core.files).where(eq(core.files.userId, user.id)),
      db.select().from(core.automationSettings).where(eq(core.automationSettings.userId, user.id)),
      db.select().from(core.events).where(eq(core.events.userId, user.id)),
      db
        .select({
          createdAt: core.sessions.createdAt,
          lastSeenAt: core.sessions.lastSeenAt,
          userAgent: core.sessions.userAgent,
          country: core.sessions.country,
        })
        .from(core.sessions)
        .where(eq(core.sessions.userId, user.id)),
      db
        .select({ provider: core.oauthAccounts.provider, email: core.oauthAccounts.email, createdAt: core.oauthAccounts.createdAt })
        .from(core.oauthAccounts)
        .where(eq(core.oauthAccounts.userId, user.id)),
    ]);
    await audit(c.env.DB_CORE, { userId: user.id, action: "data.exported" });
    c.header("Content-Disposition", `attachment; filename="jobflow-export-${new Date().toISOString().slice(0, 10)}.json"`);
    return c.json({
      exportedAt: new Date().toISOString(),
      user: publicUser(user),
      linkedAccounts: accounts,
      automationSettings: settings[0] ?? null,
      files: files.map((f) => ({
        id: f.id,
        kind: f.kind,
        filename: f.filename,
        sizeBytes: f.sizeBytes,
        sha256: f.sha256,
        createdAt: f.createdAt,
      })),
      sessions,
      events: events.map((e) => ({ name: e.name, props: e.props ? JSON.parse(e.props) : null, createdAt: e.createdAt })),
    });
  })

  // Permanent account deletion: R2 objects, all D1 rows (FK cascade), Durable Object state.
  .delete("/", zValidator("json", z.object({ confirmEmail: z.string() })), async (c) => {
    const user = c.get("user")!;
    if (c.req.valid("json").confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      throw badRequest("Type your account email to confirm deletion.");
    }
    let cursor: string | undefined;
    do {
      const list = await c.env.FILES.list({ prefix: `users/${user.id}/`, cursor });
      if (list.objects.length) await c.env.FILES.delete(list.objects.map((o) => o.key));
      cursor = list.truncated ? list.cursor : undefined;
    } while (cursor);
    await governorFor(c.env, user.id).reset();
    await audit(c.env.DB_CORE, { userId: user.id, action: "account.deleted" });
    await c.env.DB_CORE.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();
    clearSessionCookie(c);
    return c.json({ ok: true });
  });
