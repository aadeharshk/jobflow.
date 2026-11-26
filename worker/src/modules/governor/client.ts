import type { Env } from "../../env";

/** Stub for the user's OutboundGovernor Durable Object. */
export function governorFor(env: Env, userId: string) {
  return env.OUTBOUND_GOVERNOR.get(env.OUTBOUND_GOVERNOR.idFromName(`user:${userId}`));
}
