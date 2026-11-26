import { z } from "zod";
import type { OutboundGovernor } from "./modules/governor/outbound-governor";
import type { SourceLimiter } from "./modules/limiter/source-limiter";
import type { QueueMessage } from "./queues/messages";

/** Cloudflare bindings, vars and secrets available to the Worker. */
export interface Env {
  // Static assets (React SPA)
  ASSETS: Fetcher;
  // Storage
  DB_CORE: D1Database;
  DB_JOBS: D1Database;
  FILES: R2Bucket;
  // Queues
  Q_DISCOVERY: Queue<QueueMessage>;
  Q_ENRICH_MATCH: Queue<QueueMessage>;
  Q_OUTBOUND: Queue<QueueMessage>;
  Q_INBOX_SYNC: Queue<QueueMessage>;
  // Durable Objects
  OUTBOUND_GOVERNOR: DurableObjectNamespace<OutboundGovernor>;
  SOURCE_LIMITER: DurableObjectNamespace<SourceLimiter>;
  // Rate limiting (optional: absent in some local/test setups)
  AUTH_RATE_LIMITER?: RateLimit;
  API_RATE_LIMITER?: RateLimit;
  // Vars
  ENVIRONMENT: string;
  APP_URL: string;
  AUTH_DEV_LOGIN?: string;
  MAX_RESUME_BYTES?: string;
  // Secrets (wrangler secret put …)
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  TOKEN_ENCRYPTION_KEY?: string;
}

const base64Key = z.string().refine((v) => {
  try {
    return atob(v).length === 32;
  } catch {
    return false;
  }
}, "must be a base64-encoded 32-byte key (openssl rand -base64 32)");

const configSchema = z
  .object({
    environment: z.enum(["development", "test", "staging", "production"]),
    appUrl: z.url(),
    devLogin: z.boolean(),
    maxResumeBytes: z
      .number()
      .int()
      .positive()
      .max(20 * 1024 * 1024),
    googleClientId: z.string().min(1).optional(),
    googleClientSecret: z.string().min(1).optional(),
    tokenEncryptionKey: base64Key.optional(),
  })
  .superRefine((c, ctx) => {
    const deployed = c.environment === "production" || c.environment === "staging";
    if (deployed && c.devLogin) {
      ctx.addIssue({ code: "custom", message: "AUTH_DEV_LOGIN must be false in staging/production" });
    }
    if (deployed && !c.appUrl.startsWith("https://")) {
      ctx.addIssue({ code: "custom", message: "APP_URL must use https in staging/production" });
    }
    if (deployed && (!c.googleClientId || !c.googleClientSecret)) {
      ctx.addIssue({ code: "custom", message: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET secrets are required" });
    }
    if (deployed && !c.tokenEncryptionKey) {
      ctx.addIssue({ code: "custom", message: "TOKEN_ENCRYPTION_KEY secret is required" });
    }
  });

export type AppConfig = z.infer<typeof configSchema> & { secureCookies: boolean };

const cache = new WeakMap<object, AppConfig>();

/**
 * Validates configuration once per isolate. Fails closed: a misconfigured
 * production deployment refuses requests instead of running insecurely.
 */
export function getConfig(env: Env): AppConfig {
  const hit = cache.get(env);
  if (hit) return hit;
  const parsed = configSchema.safeParse({
    environment: env.ENVIRONMENT,
    appUrl: env.APP_URL,
    devLogin: env.AUTH_DEV_LOGIN === "true",
    maxResumeBytes: Number(env.MAX_RESUME_BYTES ?? 5 * 1024 * 1024),
    googleClientId: env.GOOGLE_CLIENT_ID || undefined,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET || undefined,
    tokenEncryptionKey: env.TOKEN_ENCRYPTION_KEY || undefined,
  });
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "config"}: ${i.message}`);
    throw new ConfigError(issues);
  }
  const config = { ...parsed.data, secureCookies: parsed.data.appUrl.startsWith("https://") };
  cache.set(env, config);
  return config;
}

export class ConfigError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid configuration: ${issues.join("; ")}`);
    this.name = "ConfigError";
  }
}
