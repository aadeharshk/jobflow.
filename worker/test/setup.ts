import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";

await applyD1Migrations(env.DB_CORE, env.TEST_CORE_MIGRATIONS);
await applyD1Migrations(env.DB_JOBS, env.TEST_JOBS_MIGRATIONS);
