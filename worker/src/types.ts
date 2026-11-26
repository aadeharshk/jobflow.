import type { Env, AppConfig } from "./env";
import type { User } from "./db/schema-core";

export interface SessionInfo {
  id: string;
  userId: string;
  expiresAt: number;
}

export interface AppVariables {
  config: AppConfig;
  requestId: string;
  user: User | null;
  session: SessionInfo | null;
}

export type AppEnv = { Bindings: Env; Variables: AppVariables };
