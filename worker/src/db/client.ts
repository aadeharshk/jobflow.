import { drizzle } from "drizzle-orm/d1";
import type { Env } from "../env";
import * as core from "./schema-core";
import * as jobs from "./schema-jobs";

export const coreDb = (env: Env) => drizzle(env.DB_CORE, { schema: core });
export const jobsDb = (env: Env) => drizzle(env.DB_JOBS, { schema: jobs });
export type CoreDb = ReturnType<typeof coreDb>;
export { core, jobs };
