/**
 * Pure outbound-sending policy. The OutboundGovernor Durable Object applies it atomically per user.
 * Every outbound message — initial applications AND follow-ups — counts toward the cap.
 */
export const PLATFORM_DAILY_CAP = 20;
export const WINDOW_MS = 24 * 60 * 60 * 1000;

export type DenyReason = "paused" | "cap_reached" | "cap_zero";

export type SendDecision = { allowed: true; remainingAfter: number } | { allowed: false; reason: DenyReason; retryAt: number | null };

export interface PolicyInput {
  /** Timestamps (ms) of sends/reservations that count toward the cap. */
  ledger: readonly number[];
  now: number;
  userDailyCap: number;
  paused: boolean;
}

export function effectiveCap(userDailyCap: number): number {
  if (!Number.isFinite(userDailyCap)) return 0;
  return Math.max(0, Math.min(PLATFORM_DAILY_CAP, Math.floor(userDailyCap)));
}

export function inWindow(ledger: readonly number[], now: number): number[] {
  return ledger.filter((t) => t > now - WINDOW_MS && t <= now).sort((a, b) => a - b);
}

export function evaluateSend(input: PolicyInput): SendDecision {
  if (input.paused) return { allowed: false, reason: "paused", retryAt: null };
  const cap = effectiveCap(input.userDailyCap);
  if (cap === 0) return { allowed: false, reason: "cap_zero", retryAt: null };
  const recent = inWindow(input.ledger, input.now);
  if (recent.length >= cap) {
    // The slot frees when the oldest counted send leaves the rolling window.
    const oldestRelevant = recent[recent.length - cap]!;
    return { allowed: false, reason: "cap_reached", retryAt: oldestRelevant + WINDOW_MS };
  }
  return { allowed: true, remainingAfter: cap - recent.length - 1 };
}
