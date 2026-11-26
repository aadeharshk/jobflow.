import { z } from "zod";

/**
 * Versioned queue message contracts. Producers and consumers share these schemas so each module
 * (discovery, matching, email, inbox sync) can evolve independently.
 */
export const discoveryMessage = z.object({
  v: z.literal(1),
  type: z.literal("source.check"),
  sourceId: z.string().min(1),
  cursor: z.string().optional(),
});

export const enrichMatchMessage = z.object({
  v: z.literal(1),
  type: z.literal("jobs.changed"),
  jobIds: z.array(z.string().min(1)).min(1).max(100),
});

export const outboundMessage = z.object({
  v: z.literal(1),
  type: z.literal("email.send"),
  userId: z.string().min(1),
  applicationId: z.string().min(1),
  kind: z.enum(["initial", "followup"]),
  idempotencyKey: z.string().min(8).max(200),
});

export const inboxSyncMessage = z.object({
  v: z.literal(1),
  type: z.literal("inbox.sync"),
  userId: z.string().min(1),
});

export const queueMessage = z.discriminatedUnion("type", [discoveryMessage, enrichMatchMessage, outboundMessage, inboxSyncMessage]);
export type QueueMessage = z.infer<typeof queueMessage>;
export type DiscoveryMessage = z.infer<typeof discoveryMessage>;
export type EnrichMatchMessage = z.infer<typeof enrichMatchMessage>;
export type OutboundMessage = z.infer<typeof outboundMessage>;
export type InboxSyncMessage = z.infer<typeof inboxSyncMessage>;

/** Queue name → message schema. Staging queues share schemas via the `-staging` suffix. */
export const QUEUE_SCHEMAS = {
  "jobflow-discovery": discoveryMessage,
  "jobflow-enrich-match": enrichMatchMessage,
  "jobflow-outbound": outboundMessage,
  "jobflow-inbox-sync": inboxSyncMessage,
} as const;
export type QueueName = keyof typeof QUEUE_SCHEMAS;

export function baseQueueName(name: string): QueueName | null {
  const base = name.replace(/-staging$/, "");
  return base in QUEUE_SCHEMAS ? (base as QueueName) : null;
}
