import type { Env } from "../../env";
import type { InboxSyncMessage, OutboundMessage } from "../../queues/messages";

/**
 * Email module contract.
 * Phase 6: Gmail send (incremental `gmail.send` scope) through the OutboundGovernor.
 * Reply monitoring (restricted Gmail scopes) is deliberately NOT a launch dependency:
 * users log replies manually until Google verification is complete. The inbox-sync queue and
 * `google_connections.history_id` column exist so monitoring can be enabled later without migrations.
 */
export interface OutboundEmail {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; contentType: string; r2Key: string }[];
  inReplyTo?: string; // follow-ups stay in the same thread
  threadId?: string;
}

export interface EmailProvider {
  readonly id: "gmail";
  send(userId: string, email: OutboundEmail): Promise<{ providerMessageId: string; threadId: string }>;
}

export async function handleOutbound(_env: Env, msg: OutboundMessage): Promise<void> {
  // Sending is not enabled in Phase 3. Never fall back to any other sending path.
  console.warn("outbound_disabled_phase3", { applicationId: msg.applicationId, kind: msg.kind });
}

export async function handleInboxSync(_env: Env, msg: InboxSyncMessage): Promise<void> {
  console.info("inbox_sync_disabled", { userId: msg.userId });
}
