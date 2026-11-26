import { describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:workers";
import { handleQueue } from "../src/queues/consumer";
import { scheduleDueSources } from "../src/modules/discovery";
import { assertCompliant, isBlockedHost, ComplianceError } from "../src/modules/discovery/registry";
import type { SourceAdapter } from "../src/modules/discovery/types";
import { canTransition, requiresUserApproval } from "../src/modules/applications/pipeline";
import { getConfig, ConfigError, type Env } from "../src/env";
import { coreDb, core, jobsDb, jobs } from "../src/db/client";

function fakeBatch(queue: string, bodies: unknown[]) {
  const messages = bodies.map((body, i) => ({ id: `m${i}`, timestamp: new Date(), body, attempts: 1, ack: vi.fn(), retry: vi.fn() }));
  return { batch: { queue, messages, ackAll: vi.fn(), retryAll: vi.fn() } as unknown as MessageBatch<unknown>, messages };
}

describe("queue consumer", () => {
  it("acknowledges malformed messages instead of retrying forever", async () => {
    const { batch, messages } = fakeBatch("jobflow-discovery", [{ nope: true }]);
    await handleQueue(batch, env);
    expect(messages[0]!.ack).toHaveBeenCalled();
    expect(messages[0]!.retry).not.toHaveBeenCalled();
  });

  it("routes valid messages (staging suffix supported)", async () => {
    const { batch, messages } = fakeBatch("jobflow-outbound-staging", [
      { v: 1, type: "email.send", userId: "u1", applicationId: "a1", kind: "initial", idempotencyKey: "a1-initial" },
    ]);
    await handleQueue(batch, env);
    expect(messages[0]!.ack).toHaveBeenCalled();
  });

  it("acks unknown queues", async () => {
    const { batch } = fakeBatch("something-else", [{}]);
    await handleQueue(batch, env);
    expect(batch.ackAll).toHaveBeenCalled();
  });
});

describe("discovery scheduling & compliance", () => {
  it("database refuses to enable a source whose terms were never reviewed", async () => {
    await expect(
      env.DB_JOBS.prepare(
        "INSERT INTO sources (id, kind, name, access_method, enabled) VALUES ('x', 'greenhouse', 'X', 'official_api', 1)",
      ).run(),
    ).rejects.toThrow();
  });

  it("database refuses unknown access methods (e.g. scraping)", async () => {
    await expect(
      env.DB_JOBS.prepare("INSERT INTO sources (id, kind, name, access_method) VALUES ('y', 'x', 'Y', 'scrape')").run(),
    ).rejects.toThrow();
  });

  it("enqueues only enabled, reviewed, due sources", async () => {
    const now = Date.now();
    await env.DB_JOBS.batch([
      env.DB_JOBS.prepare(
        "INSERT INTO sources (id, kind, name, access_method, terms_url, terms_reviewed_at, enabled, next_check_at) VALUES ('due', 'greenhouse', 'Due', 'official_api', 'https://example.com/terms', ?, 1, ?)",
      ).bind(now, now - 1),
      env.DB_JOBS.prepare(
        "INSERT INTO sources (id, kind, name, access_method, terms_url, terms_reviewed_at, enabled, next_check_at) VALUES ('later', 'lever', 'Later', 'official_api', 'https://example.com/terms', ?, 1, ?)",
      ).bind(now, now + 3600_000),
      env.DB_JOBS.prepare("INSERT INTO sources (id, kind, name, access_method, enabled) VALUES ('off', 'ashby', 'Off', 'official_api', 0)"),
    ]);
    const spy = vi.spyOn(env.Q_DISCOVERY, "sendBatch");
    expect(await scheduleDueSources(env, now)).toBe(1);
    expect(spy.mock.calls[0]![0]).toEqual([{ body: { v: 1, type: "source.check", sourceId: "due" } }]);
    spy.mockRestore();
  });

  const adapter = (overrides: Partial<SourceAdapter["compliance"]> = {}): SourceAdapter => ({
    kind: "test",
    displayName: "Test",
    regions: ["IN"],
    compliance: {
      accessMethod: "official_api",
      termsUrl: "https://example.com/terms",
      termsReviewedOn: "2026-11-26",
      rateLimit: { ratePerMinute: 10, burst: 2 },
      minIntervalMinutes: 60,
      ...overrides,
    },
    fetchJobs: async () => ({ notModified: true, jobs: [] }),
  });

  it("requires adapters to declare compliant access", () => {
    expect(() => assertCompliant(adapter())).not.toThrow();
    expect(() => assertCompliant(adapter({ accessMethod: "scrape" as never }))).toThrow(ComplianceError);
    expect(() => assertCompliant(adapter({ termsUrl: "http://insecure" }))).toThrow(ComplianceError);
    expect(() => assertCompliant(adapter({ minIntervalMinutes: 1 }))).toThrow(ComplianceError);
  });

  it("blocks hosts whose terms forbid automated access", () => {
    expect(isBlockedHost("https://www.linkedin.com/jobs/view/123")).toBe(true);
    expect(isBlockedHost("https://in.linkedin.com/jobs")).toBe(true);
    expect(isBlockedHost("https://boards.greenhouse.io/acme")).toBe(false);
    expect(isBlockedHost("not a url")).toBe(true);
  });
});

describe("application pipeline", () => {
  it("only allows valid transitions and requires approval before sending", () => {
    expect(canTransition("ready", "approved")).toBe(true);
    expect(canTransition("ready", "sent")).toBe(false);
    expect(canTransition("rejected", "interview")).toBe(false);
    expect(requiresUserApproval("approved")).toBe(true);
  });
});

describe("configuration (fail closed)", () => {
  const base = {
    ENVIRONMENT: "production",
    APP_URL: "https://jobflow.example.com",
    AUTH_DEV_LOGIN: "false",
    GOOGLE_CLIENT_ID: "id",
    GOOGLE_CLIENT_SECRET: "secret",
    TOKEN_ENCRYPTION_KEY: btoa("x".repeat(32)),
  };
  const cfg = (o: Record<string, string | undefined>) => getConfig({ ...base, ...o } as unknown as Env);

  it("accepts a complete production config with secure cookies", () => {
    expect(cfg({}).secureCookies).toBe(true);
  });
  it("refuses dev login in production", () => expect(() => cfg({ AUTH_DEV_LOGIN: "true" })).toThrow(ConfigError));
  it("refuses http APP_URL in production", () => expect(() => cfg({ APP_URL: "http://jobflow.example.com" })).toThrow(ConfigError));
  it("requires secrets in production", () => {
    expect(() => cfg({ TOKEN_ENCRYPTION_KEY: undefined })).toThrow(/TOKEN_ENCRYPTION_KEY/);
    expect(() => cfg({ GOOGLE_CLIENT_SECRET: undefined })).toThrow(/GOOGLE_CLIENT_ID/);
  });
  it("rejects weak encryption keys", () => expect(() => cfg({ TOKEN_ENCRYPTION_KEY: btoa("short") })).toThrow(ConfigError));
});

describe("schema mirror", () => {
  it("Drizzle schemas match migrated tables", async () => {
    const c = coreDb(env);
    const j = jobsDb(env);
    for (const table of [
      core.users,
      core.oauthAccounts,
      core.sessions,
      core.googleConnections,
      core.files,
      core.automationSettings,
      core.auditLog,
      core.events,
    ]) {
      await expect(c.select().from(table).limit(1)).resolves.toBeDefined();
    }
    for (const table of [jobs.sources, jobs.companies, jobs.jobs, jobs.publicContacts]) {
      await expect(j.select().from(table).limit(1)).resolves.toBeDefined();
    }
  });
});
