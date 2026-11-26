import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "./types";
import { getConfig } from "./env";
import { validateSession } from "./modules/auth/sessions";
import { tooManyRequests, unauthorized, forbidden } from "./lib/errors";
import { newId } from "./lib/crypto";

export const withConfig: MiddlewareHandler<AppEnv> = async (c, next) => {
  c.set("config", getConfig(c.env));
  c.set("requestId", c.req.header("cf-ray") ?? newId());
  c.set("user", null);
  c.set("session", null);
  await next();
};

export const withSession: MiddlewareHandler<AppEnv> = async (c, next) => {
  const result = await validateSession(c);
  if (result) {
    c.set("user", result.user);
    c.set("session", result.session);
  }
  await next();
};

export const requireUser: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (!c.get("user")) throw unauthorized();
  await next();
};

export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  const user = c.get("user");
  if (!user) throw unauthorized();
  if (user.role !== "admin") throw forbidden();
  await next();
};

/** Best-effort per-location rate limiting via the Workers Rate Limiting binding. */
export function rateLimit(binding: "AUTH_RATE_LIMITER" | "API_RATE_LIMITER"): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const limiter = c.env[binding];
    if (limiter) {
      const key = c.get("user")?.id ?? c.req.header("cf-connecting-ip") ?? "anonymous";
      const { success } = await limiter.limit({ key });
      if (!success) throw tooManyRequests();
    }
    await next();
  };
}

/** Strict security headers for API responses (the SPA's headers are set in web/public/_headers). */
export const apiSecurityHeaders: MiddlewareHandler<AppEnv> = async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("X-Frame-Options", "DENY");
  c.header("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  if (c.get("config")?.secureCookies) c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
};
