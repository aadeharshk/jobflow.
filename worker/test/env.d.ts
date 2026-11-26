import type { Env as WorkerEnv } from "../src/env";
import type { D1Migration } from "cloudflare:test";

declare global {
  namespace Cloudflare {
    interface Env extends WorkerEnv {
      TEST_CORE_MIGRATIONS: D1Migration[];
      TEST_JOBS_MIGRATIONS: D1Migration[];
    }
  }
}
export {};
