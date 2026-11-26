import { createApp } from "./app";
import { handleQueue } from "./queues/consumer";
import { handleScheduled } from "./scheduled";
import type { Env } from "./env";

export { OutboundGovernor } from "./modules/governor/outbound-governor";
export { SourceLimiter } from "./modules/limiter/source-limiter";

const app = createApp();

export default {
  fetch: (request, env, ctx) => app.fetch(request, env, ctx),
  queue: (batch, env) => handleQueue(batch, env),
  scheduled: (controller, env, ctx) => {
    ctx.waitUntil(handleScheduled(controller, env));
  },
} satisfies ExportedHandler<Env, unknown>;
