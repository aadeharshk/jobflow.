import { describe, expect, it } from "vitest";
import { evaluateSend, effectiveCap, PLATFORM_DAILY_CAP, WINDOW_MS } from "../src/modules/governor/policy";
import { takeToken } from "../src/modules/limiter/source-limiter";

const HOUR = 60 * 60 * 1000;

describe("outbound policy (20 messages per rolling 24h)", () => {
  it("never allows a cap above the platform maximum", () => {
    expect(effectiveCap(50)).toBe(PLATFORM_DAILY_CAP);
    expect(effectiveCap(-3)).toBe(0);
    expect(effectiveCap(Number.NaN)).toBe(0);
    expect(effectiveCap(7.9)).toBe(7);
  });

  it("blocks when paused", () => {
    expect(evaluateSend({ ledger: [], now: 0, userDailyCap: 20, paused: true })).toEqual({
      allowed: false,
      reason: "paused",
      retryAt: null,
    });
  });

  it("blocks the 21st message and reports when the next slot frees", () => {
    const now = 100 * HOUR;
    const ledger = Array.from({ length: 20 }, (_, i) => now - 23 * HOUR + i * 60_000);
    const d = evaluateSend({ ledger, now, userDailyCap: 20, paused: false });
    expect(d.allowed).toBe(false);
    if (!d.allowed) expect(d.retryAt).toBe(ledger[0]! + WINDOW_MS);
  });

  it("frees slots as sends leave the rolling window", () => {
    const now = 100 * HOUR;
    const ledger = [now - 25 * HOUR, ...Array.from({ length: 19 }, (_, i) => now - i * 1000)];
    expect(evaluateSend({ ledger, now, userDailyCap: 20, paused: false })).toEqual({ allowed: true, remainingAfter: 0 });
  });

  it("property: simulated random traffic never exceeds 20 in any 24h window", () => {
    let seed = 42;
    const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
    for (let run = 0; run < 25; run++) {
      const ledger: number[] = [];
      let now = 0;
      for (let attempt = 0; attempt < 400; attempt++) {
        now += Math.floor(rand() * 2 * HOUR);
        const cap = Math.floor(rand() * 30); // users may request > 20; must be clamped
        if (evaluateSend({ ledger, now, userDailyCap: cap, paused: false }).allowed) ledger.push(now);
      }
      for (const t of ledger) {
        const inWindow = ledger.filter((x) => x > t - WINDOW_MS && x <= t).length;
        expect(inWindow).toBeLessThanOrEqual(PLATFORM_DAILY_CAP);
      }
    }
  });
});

describe("token bucket", () => {
  const config = { ratePerMinute: 60, burst: 2 };
  it("allows bursts then throttles", () => {
    let state = { tokens: 2, updatedAt: 0 };
    let r = takeToken(state, config, 0);
    expect(r.result.granted).toBe(true);
    state = r.state;
    r = takeToken(state, config, 0);
    expect(r.result.granted).toBe(true);
    state = r.state;
    r = takeToken(state, config, 0);
    expect(r.result).toEqual({ granted: false, retryAfterMs: 1000 });
  });
  it("refills over time but never above burst", () => {
    const r = takeToken({ tokens: 0, updatedAt: 0 }, config, 10 * 60_000);
    expect(r.result.granted).toBe(true);
    expect(r.state.tokens).toBe(1);
  });
});
