import { and, eq } from "drizzle-orm";
import { coreDb, core } from "../../db/client";
import { newId } from "../../lib/crypto";
import { audit, trackEvent } from "../../lib/audit";
import type { Env } from "../../env";
import type { User } from "../../db/schema-core";

export interface IdentityProfile {
  provider: "google" | "dev";
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * Finds or creates the user for an external identity.
 * Linking by email is allowed only for verified emails.
 */
export async function upsertUserFromIdentity(env: Env, identity: IdentityProfile): Promise<{ user: User; created: boolean }> {
  const db = coreDb(env);
  const now = Date.now();
  const email = identity.email.trim().toLowerCase();

  if (identity.provider === "google") {
    const linked = await db
      .select({ user: core.users })
      .from(core.oauthAccounts)
      .innerJoin(core.users, eq(core.users.id, core.oauthAccounts.userId))
      .where(and(eq(core.oauthAccounts.provider, "google"), eq(core.oauthAccounts.providerUserId, identity.providerUserId)))
      .limit(1);
    if (linked[0]) {
      const [updated] = await db
        .update(core.users)
        .set({
          name: linked[0].user.name ?? identity.name ?? null,
          avatarUrl: identity.avatarUrl ?? linked[0].user.avatarUrl,
          emailVerified: identity.emailVerified,
          updatedAt: now,
        })
        .where(eq(core.users.id, linked[0].user.id))
        .returning();
      return { user: updated!, created: false };
    }
  }

  const existing = await db.select().from(core.users).where(eq(core.users.email, email)).limit(1);
  let user = existing[0];
  let created = false;
  if (!user) {
    if (!identity.emailVerified) throw new Error("Email must be verified to create an account");
    const id = newId();
    [user] = await db
      .insert(core.users)
      .values({
        id,
        email,
        emailVerified: true,
        name: identity.name ?? null,
        avatarUrl: identity.avatarUrl ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    await db.insert(core.automationSettings).values({ userId: id, updatedAt: now });
    created = true;
  } else if (!identity.emailVerified) {
    throw new Error("Refusing to link an unverified email to an existing account");
  }

  if (identity.provider === "google") {
    await db.insert(core.oauthAccounts).values({
      id: newId(),
      userId: user!.id,
      provider: "google",
      providerUserId: identity.providerUserId,
      email,
      createdAt: now,
      updatedAt: now,
    });
  }
  if (created) {
    await trackEvent(env.DB_CORE, user!.id, "signed_up", { provider: identity.provider });
    await audit(env.DB_CORE, { userId: user!.id, action: "account.created", metadata: { provider: identity.provider } });
  }
  return { user: user!, created };
}
