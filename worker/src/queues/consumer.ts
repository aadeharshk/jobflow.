import type { Env } from "../env";
import { baseQueueName, QUEUE_SCHEMAS } from "./messages";
import { handleDiscovery } from "../modules/discovery";
import { handleEnrichMatch } from "../modules/matching";
import { handleOutbound, handleInboxSync } from "../modules/email";

/**
 * Routes each queue batch to its module. Invalid messages are acknowledged and logged (never retried:
 * retrying a malformed message cannot succeed). Handler failures are retried with backoff and land in
 * the dead-letter queue after max_retries.
 */
export async function handleQueue(batch: MessageBatch<unknown>, env: Env): Promise<void> {
  const name = baseQueueName(batch.queue);
  if (!name) {
    console.error("unknown_queue", { queue: batch.queue });
    batch.ackAll();
    return;
  }
  const schema = QUEUE_SCHEMAS[name];
  for (const message of batch.messages) {
    const parsed = schema.safeParse(message.body);
    if (!parsed.success) {
      console.error("invalid_queue_message", { queue: batch.queue, id: message.id, issues: parsed.error.issues.length });
      message.ack();
      continue;
    }
    try {
      const body = parsed.data;
      switch (body.type) {
        case "source.check":
          await handleDiscovery(env, body);
          break;
        case "jobs.changed":
          await handleEnrichMatch(env, body);
          break;
        case "email.send":
          await handleOutbound(env, body);
          break;
        case "inbox.sync":
          await handleInboxSync(env, body);
          break;
      }
      message.ack();
    } catch (err) {
      console.error("queue_handler_failed", { queue: batch.queue, id: message.id, attempts: message.attempts, error: String(err) });
      message.retry({ delaySeconds: Math.min(900, 30 * 2 ** Math.max(0, message.attempts - 1)) });
    }
  }
}
