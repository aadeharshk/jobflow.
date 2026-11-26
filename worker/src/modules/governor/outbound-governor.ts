import { DurableObject } from "cloudflare:workers";
import { evaluateSend, effectiveCap, inWindow, PLATFORM_DAILY_CAP, WINDOW_MS, type DenyReason } from "./policy";

export type SendKind = "initial" | "followup";

export interface ReserveRequest {
  idempotencyKey: string;
  kind: SendKind;
  applicationId?: string;
}

export type ReserveResult =
  | { status: "reserved"; remainingAfter: number }
  | { status: "duplicate"; state: "reserved" | "sent" }
  | { status: "denied"; reason: DenyReason | "invalid_request"; retryAt: number | null };

export interface GovernorStatus {
  paused: boolean;
  dailyCap: number;
  sentInWindow: number;
  remaining: number;
  nextSlotAt: number | null;
}

const IDEMPOTENCY_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * One instance per user (idFromName(userId)). Durable Objects process requests one at a time,
 * so check-and-reserve is atomic even with many concurrent queue consumers.
 *
 * Safety rule: a reservation counts toward the cap until it is explicitly released
 * (send failed before reaching Gmail). If the Worker crashes mid-send, the slot stays consumed —
 * we prefer under-sending to ever exceeding the user's promise.
 */
export class OutboundGovernor extends DurableObject {
  private sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env as never);
    this.sql = ctx.storage.sql;
    ctx.blockConcurrencyWhile(async () => this.migrate());
  }

  private migrate() {
    this.sql.exec(`
        CREATE TABLE IF NOT EXISTS ledger (
          idempotency_key TEXT PRIMARY KEY,
          kind TEXT NOT NULL,
          application_id TEXT,
          state TEXT NOT NULL CHECK (state IN ('reserved','sent')),
          reserved_at INTEGER NOT NULL,
          sent_at INTEGER,
          provider_message_id TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_ledger_time ON ledger(reserved_at);
        CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK (id = 1), paused INTEGER NOT NULL, daily_cap INTEGER NOT NULL);
        INSERT OR IGNORE INTO settings (id, paused, daily_cap) VALUES (1, 0, ${PLATFORM_DAILY_CAP});
      `);
  }

  private settings(): { paused: boolean; dailyCap: number } {
    const row = this.sql.exec<{ paused: number; daily_cap: number }>("SELECT paused, daily_cap FROM settings WHERE id = 1").one();
    return { paused: row.paused === 1, dailyCap: row.daily_cap };
  }

  private ledgerTimes(now: number): number[] {
    return this.sql
      .exec<{ reserved_at: number }>("SELECT reserved_at FROM ledger WHERE reserved_at > ?", now - WINDOW_MS)
      .toArray()
      .map((r) => r.reserved_at);
  }

  async configure(input: { paused?: boolean; dailyCap?: number }): Promise<GovernorStatus> {
    const current = this.settings();
    const paused = input.paused ?? current.paused;
    const dailyCap = effectiveCap(input.dailyCap ?? current.dailyCap);
    this.sql.exec("UPDATE settings SET paused = ?, daily_cap = ? WHERE id = 1", paused ? 1 : 0, dailyCap);
    return this.status();
  }

  async status(now = Date.now()): Promise<GovernorStatus> {
    const { paused, dailyCap } = this.settings();
    const recent = inWindow(this.ledgerTimes(now), now);
    const cap = effectiveCap(dailyCap);
    const remaining = Math.max(0, cap - recent.length);
    const nextSlotAt = remaining > 0 ? null : recent.length >= cap && cap > 0 ? recent[recent.length - cap]! + WINDOW_MS : null;
    return { paused, dailyCap: cap, sentInWindow: recent.length, remaining, nextSlotAt };
  }

  async reserve(req: ReserveRequest, now = Date.now()): Promise<ReserveResult> {
    if (!req.idempotencyKey || req.idempotencyKey.length > 200 || (req.kind !== "initial" && req.kind !== "followup")) {
      return { status: "denied", reason: "invalid_request", retryAt: null };
    }
    const existing = this.sql
      .exec<{ state: "reserved" | "sent" }>("SELECT state FROM ledger WHERE idempotency_key = ?", req.idempotencyKey)
      .toArray()[0];
    if (existing) return { status: "duplicate", state: existing.state };

    const { paused, dailyCap } = this.settings();
    const decision = evaluateSend({ ledger: this.ledgerTimes(now), now, userDailyCap: dailyCap, paused });
    if (!decision.allowed) return { status: "denied", reason: decision.reason, retryAt: decision.retryAt };

    this.sql.exec(
      "INSERT INTO ledger (idempotency_key, kind, application_id, state, reserved_at) VALUES (?, ?, ?, 'reserved', ?)",
      req.idempotencyKey,
      req.kind,
      req.applicationId ?? null,
      now,
    );
    this.prune(now);
    return { status: "reserved", remainingAfter: decision.remainingAfter };
  }

  /** Marks a reservation as sent (provider accepted the message). */
  async confirm(idempotencyKey: string, providerMessageId: string, now = Date.now()): Promise<boolean> {
    const cursor = this.sql.exec(
      "UPDATE ledger SET state = 'sent', sent_at = ?, provider_message_id = ? WHERE idempotency_key = ? AND state = 'reserved'",
      now,
      providerMessageId,
      idempotencyKey,
    );
    return cursor.rowsWritten > 0;
  }

  /** Frees a slot ONLY when the provider definitely did not accept the message. */
  async release(idempotencyKey: string): Promise<boolean> {
    const cursor = this.sql.exec("DELETE FROM ledger WHERE idempotency_key = ? AND state = 'reserved'", idempotencyKey);
    return cursor.rowsWritten > 0;
  }

  /** Removes all state (account deletion). */
  async reset(): Promise<void> {
    await this.ctx.storage.deleteAll();
    this.migrate(); // the instance may stay in memory; recreate empty tables
  }

  private prune(now: number) {
    this.sql.exec("DELETE FROM ledger WHERE reserved_at < ?", now - IDEMPOTENCY_RETENTION_MS);
  }
}
