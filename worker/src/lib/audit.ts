import { newId } from "./crypto";

/** Records a security-relevant action. Never pass secrets, tokens or message bodies in metadata. */
export async function audit(
  db: D1Database,
  entry: { userId: string | null; action: string; target?: string; metadata?: Record<string, unknown> },
): Promise<void> {
  await db
    .prepare("INSERT INTO audit_log (id, user_id, action, target, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(newId(), entry.userId, entry.action, entry.target ?? null, entry.metadata ? JSON.stringify(entry.metadata) : null, Date.now())
    .run();
}

/** First-party product analytics event (activation/retention), also shown in the user's activity feed. */
export async function trackEvent(db: D1Database, userId: string | null, name: string, props?: Record<string, unknown>): Promise<void> {
  await db
    .prepare("INSERT INTO events (id, user_id, name, props, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(newId(), userId, name, props ? JSON.stringify(props) : null, Date.now())
    .run();
}
