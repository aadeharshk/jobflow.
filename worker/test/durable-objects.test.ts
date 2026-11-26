import { describe, expect, it } from "vitest";
import { env } from "cloudflare:workers";

const governor = (name: string) => env.OUTBOUND_GOVERNOR.get(env.OUTBOUND_GOVERNOR.idFromName(name));

describe("OutboundGovernor Durable Object", () => {
  it("allows exactly 20 sends under heavy concurrency", async () => {
    const g = governor(`concurrency-${crypto.randomUUID()}`);
    const results = await Promise.all(
      Array.from({ length: 35 }, (_, i) => g.reserve({ idempotencyKey: `app-${i}-initial`, kind: "initial" })),
    );
    const reserved = results.filter((r) => r.status === "reserved").length;
    const denied = results.filter((r) => r.status === "denied");
    expect(reserved).toBe(20);
    expect(denied).toHaveLength(15);
    expect(denied.every((d) => d.status === "denied" && d.reason === "cap_reached" && typeof d.retryAt === "number")).toBe(true);
    const status = await g.status();
    expect(status).toMatchObject({ sentInWindow: 20, remaining: 0 });
  });

  it("counts follow-ups toward the same cap", async () => {
    const g = governor(`followups-${crypto.randomUUID()}`);
    for (let i = 0; i < 10; i++) expect((await g.reserve({ idempotencyKey: `a${i}`, kind: "initial" })).status).toBe("reserved");
    for (let i = 0; i < 10; i++) expect((await g.reserve({ idempotencyKey: `f${i}`, kind: "followup" })).status).toBe("reserved");
    expect((await g.reserve({ idempotencyKey: "f-extra", kind: "followup" })).status).toBe("denied");
  });

  it("is idempotent per key", async () => {
    const g = governor(`idem-${crypto.randomUUID()}`);
    expect((await g.reserve({ idempotencyKey: "k1", kind: "initial" })).status).toBe("reserved");
    expect(await g.reserve({ idempotencyKey: "k1", kind: "initial" })).toEqual({ status: "duplicate", state: "reserved" });
    expect(await g.confirm("k1", "gmail-msg-1")).toBe(true);
    expect(await g.reserve({ idempotencyKey: "k1", kind: "initial" })).toEqual({ status: "duplicate", state: "sent" });
    expect((await g.status()).sentInWindow).toBe(1);
  });

  it("releases only unsent reservations", async () => {
    const g = governor(`release-${crypto.randomUUID()}`);
    await g.reserve({ idempotencyKey: "r1", kind: "initial" });
    await g.reserve({ idempotencyKey: "r2", kind: "initial" });
    await g.confirm("r2", "msg");
    expect(await g.release("r1")).toBe(true);
    expect(await g.release("r2")).toBe(false); // sent messages always count
    expect((await g.status()).sentInWindow).toBe(1);
  });

  it("honours pause and user caps (clamped to 20)", async () => {
    const g = governor(`pause-${crypto.randomUUID()}`);
    await g.configure({ paused: true });
    expect(await g.reserve({ idempotencyKey: "p1", kind: "initial" })).toEqual({ status: "denied", reason: "paused", retryAt: null });
    expect((await g.configure({ paused: false, dailyCap: 500 })).dailyCap).toBe(20);
    await g.configure({ dailyCap: 2 });
    await g.reserve({ idempotencyKey: "p2", kind: "initial" });
    await g.reserve({ idempotencyKey: "p3", kind: "initial" });
    expect((await g.reserve({ idempotencyKey: "p4", kind: "initial" })).status).toBe("denied");
  });

  it("frees capacity after 24 hours (rolling window)", async () => {
    const g = governor(`window-${crypto.randomUUID()}`);
    const t0 = 1_000_000_000_000;
    for (let i = 0; i < 20; i++) await g.reserve({ idempotencyKey: `w${i}`, kind: "initial" }, t0 + i);
    expect((await g.reserve({ idempotencyKey: "late", kind: "initial" }, t0 + 23 * 3600_000)).status).toBe("denied");
    expect((await g.reserve({ idempotencyKey: "later", kind: "initial" }, t0 + 24 * 3600_000 + 1)).status).toBe("reserved");
  });

  it("rejects invalid requests without consuming capacity", async () => {
    const g = governor(`invalid-${crypto.randomUUID()}`);
    expect(await g.reserve({ idempotencyKey: "", kind: "initial" })).toEqual({
      status: "denied",
      reason: "invalid_request",
      retryAt: null,
    });
    expect(await g.reserve({ idempotencyKey: "k", kind: "bulk" as never })).toMatchObject({ reason: "invalid_request" });
    expect((await g.status()).sentInWindow).toBe(0);
  });

  it("reset wipes all state", async () => {
    const g = governor(`reset-${crypto.randomUUID()}`);
    await g.reserve({ idempotencyKey: "x", kind: "initial" });
    await g.configure({ paused: true, dailyCap: 3 });
    await g.reset();
    expect(await g.status()).toEqual({ paused: false, dailyCap: 20, sentInWindow: 0, remaining: 20, nextSlotAt: null });
    expect((await g.reserve({ idempotencyKey: "x", kind: "initial" })).status).toBe("reserved");
  });
});

describe("SourceLimiter Durable Object", () => {
  it("enforces the configured rate", async () => {
    const l = env.SOURCE_LIMITER.get(env.SOURCE_LIMITER.idFromName(`source:${crypto.randomUUID()}`));
    expect(await l.configure({ ratePerMinute: 6, burst: 2 })).toBe(true);
    const now = Date.now();
    expect((await l.acquire(1, now)).granted).toBe(true);
    expect((await l.acquire(1, now)).granted).toBe(true);
    const third = await l.acquire(1, now);
    expect(third.granted).toBe(false);
    if (!third.granted) expect(third.retryAfterMs).toBe(10_000);
    expect((await l.acquire(1, now + 10_000)).granted).toBe(true);
  });

  it("rejects invalid configuration", async () => {
    const l = env.SOURCE_LIMITER.get(env.SOURCE_LIMITER.idFromName(`source:${crypto.randomUUID()}`));
    expect(await l.configure({ ratePerMinute: 0, burst: 1 })).toBe(false);
    expect(await l.configure({ ratePerMinute: 10, burst: 0 })).toBe(false);
  });
});
