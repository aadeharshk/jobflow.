import type { Env } from "../../env";
import type { DiscoveryMessage } from "../../queues/messages";
import { getAdapter } from "./registry";

/** Cron (hourly): enqueue checks for enabled, terms-reviewed sources that are due. */
export async function scheduleDueSources(env: Env, now = Date.now()): Promise<number> {
  const { results } = await env.DB_JOBS.prepare(
    "SELECT id FROM sources WHERE enabled = 1 AND terms_reviewed_at IS NOT NULL AND next_check_at <= ? ORDER BY next_check_at LIMIT 500",
  )
    .bind(now)
    .all<{ id: string }>();
  if (results.length === 0) return 0;
  for (let i = 0; i < results.length; i += 100) {
    await env.Q_DISCOVERY.sendBatch(
      results.slice(i, i + 100).map((r) => ({ body: { v: 1 as const, type: "source.check" as const, sourceId: r.id } })),
    );
  }
  return results.length;
}

/** Queue consumer. Phase 3: validates and acknowledges; Phase 4 implements fetching via adapters. */
export async function handleDiscovery(env: Env, msg: DiscoveryMessage): Promise<void> {
  const row = await env.DB_JOBS.prepare("SELECT kind, enabled FROM sources WHERE id = ?")
    .bind(msg.sourceId)
    .first<{ kind: string; enabled: number }>();
  if (!row || row.enabled !== 1) return;
  const adapter = getAdapter(row.kind);
  if (!adapter) {
    console.warn("discovery_adapter_missing", { sourceId: msg.sourceId, kind: row.kind });
    return;
  }
  // Phase 4: SourceLimiter.acquire → adapter.fetchJobs → normalise/upsert → enqueue jobs.changed
  console.info("discovery_not_implemented", { sourceId: msg.sourceId });
}
