import { Hono, type MiddlewareHandler } from "hono";
import type { AppEnv } from "./types";
import { ConfigError } from "./env";
import { HttpError, forbidden } from "./lib/errors";
import { apiSecurityHeaders, rateLimit, requireUser, withConfig, withSession } from "./middleware";
import { authRoutes } from "./modules/auth/routes";
import { userRoutes } from "./modules/users/routes";
import { fileRoutes } from "./modules/files/routes";

const UNSAFE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * CSRF defence for cookie-authenticated APIs: every state-changing request must come from
 * an allowed Origin (or, if Origin is absent, a same-origin Fetch Metadata signal).
 * Complements SameSite=Lax cookies; applies to ALL content types (unlike form-only checks).
 */
export const originCheck: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (UNSAFE.has(c.req.method)) {
    const config = c.get("config");
    const allowed = new Set([new URL(config.appUrl).origin]);
    if (config.environment === "development") {
      allowed.add("http://localhost:5173");
      allowed.add("http://localhost:8787");
    }
    const origin = c.req.header("origin");
    const fetchSite = c.req.header("sec-fetch-site");
    const ok = origin ? allowed.has(origin) : fetchSite === "same-origin";
    if (!ok) throw forbidden("Cross-origin request blocked.");
  }
  await next();
};

export function createApp() {
  const app = new Hono<AppEnv>().basePath("/api");

  app.onError((err, c) => {
    if (err instanceof HttpError) {
      return c.json({ error: { code: err.code, message: err.message, details: err.details } }, err.status);
    }
    if (err instanceof ConfigError) {
      console.error("config_error", err.issues);
      return c.json({ error: { code: "misconfigured", message: "Service misconfigured." } }, 503);
    }
    console.error("unhandled_error", { path: c.req.path, message: err instanceof Error ? err.message : String(err) });
    return c.json({ error: { code: "internal", message: "Something went wrong.", requestId: c.get("requestId") } }, 500);
  });
  app.notFound((c) => c.json({ error: { code: "not_found", message: "Route not found." } }, 404));

  app.use("*", apiSecurityHeaders, withConfig, originCheck, withSession);

  app.get("/health", async (c) => {
    const [core, jobs] = await Promise.all([
      c.env.DB_CORE.prepare("SELECT 1 AS ok").first<{ ok: number }>(),
      c.env.DB_JOBS.prepare("SELECT 1 AS ok").first<{ ok: number }>(),
    ]);
    return c.json({ status: "ok", environment: c.get("config").environment, checks: { dbCore: core?.ok === 1, dbJobs: jobs?.ok === 1 } });
  });

  app.use("/auth/*", rateLimit("AUTH_RATE_LIMITER"));
  app.route("/auth", authRoutes);

  app.use("/me/*", requireUser, rateLimit("API_RATE_LIMITER"));
  app.use("/me", requireUser, rateLimit("API_RATE_LIMITER"));
  app.route("/me", userRoutes);

  app.use("/files/*", requireUser, rateLimit("API_RATE_LIMITER"));
  app.route("/files", fileRoutes);

  return app;
}
