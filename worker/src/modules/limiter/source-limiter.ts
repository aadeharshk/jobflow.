import { DurableObject } from "cloudflare:workers";

export interface LimiterConfig {
  /** Tokens added per minute (sustained request rate allowed by the source's terms). */
  ratePerMinute: number;
  /** Maximum burst size. */
  burst: number;
}

export type AcquireResult = { granted: true; tokensLeft: number } | { granted: false; retryAfterMs: number };

export const DEFAULT_LIMITER_CONFIG: LimiterConfig = { ratePerMinute: 30, burst: 5 };

/** Pure token-bucket refill + take. Exported for unit tests. */
export function takeToken(
  state: { tokens: number; updatedAt: number },
  config: LimiterConfig,
  now: number,
  cost = 1,
): { state: { tokens: number; updatedAt: number }; result: AcquireResult } {
  const perMs = config.ratePerMinute / 60_000;
  const elapsed = Math.max(0, now - state.updatedAt);
  const tokens = Math.min(config.burst, state.tokens + elapsed * perMs);
  if (tokens >= cost) {
    return { state: { tokens: tokens - cost, updatedAt: now }, result: { granted: true, tokensLeft: Math.floor(tokens - cost) } };
  }
  const retryAfterMs = Math.ceil((cost - tokens) / perMs);
  return { state: { tokens, updatedAt: now }, result: { granted: false, retryAfterMs } };
}

/**
 * One instance per job source or crawl domain (idFromName("source:greenhouse") / "domain:example.com").
 * Keeps JobFlow inside each source's documented rate limits regardless of queue concurrency.
 */
export class SourceLimiter extends DurableObject {
  private sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env as never);
    this.sql = ctx.storage.sql;
    ctx.blockConcurrencyWhile(async () => {
      this.sql.exec(`
        CREATE TABLE IF NOT EXISTS bucket (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          tokens REAL NOT NULL, updated_at INTEGER NOT NULL,
          rate_per_minute REAL NOT NULL, burst REAL NOT NULL
        );
        INSERT OR IGNORE INTO bucket (id, tokens, updated_at, rate_per_minute, burst)
        VALUES (1, ${DEFAULT_LIMITER_CONFIG.burst}, 0, ${DEFAULT_LIMITER_CONFIG.ratePerMinute}, ${DEFAULT_LIMITER_CONFIG.burst});
      `);
    });
  }

  private read() {
    return this.sql
      .exec<{ tokens: number; updated_at: number; rate_per_minute: number; burst: number }>("SELECT * FROM bucket WHERE id = 1")
      .one();
  }

  /** Returns false (instead of throwing across RPC) when the config is invalid. */
  async configure(config: LimiterConfig): Promise<boolean> {
    if (!(config.ratePerMinute > 0) || !(config.burst >= 1)) return false;
    this.sql.exec(
      "UPDATE bucket SET rate_per_minute = ?, burst = ?, tokens = MIN(tokens, ?) WHERE id = 1",
      config.ratePerMinute,
      config.burst,
      config.burst,
    );
    return true;
  }

  async acquire(cost = 1, now = Date.now()): Promise<AcquireResult> {
    const row = this.read();
    const { state, result } = takeToken(
      { tokens: row.tokens, updatedAt: row.updated_at || now },
      { ratePerMinute: row.rate_per_minute, burst: row.burst },
      now,
      cost,
    );
    this.sql.exec("UPDATE bucket SET tokens = ?, updated_at = ? WHERE id = 1", state.tokens, state.updatedAt);
    return result;
  }
}
