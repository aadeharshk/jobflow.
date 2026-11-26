/**
 * Application pipeline state machine (UI + API in Phase 6). Defined now so other modules
 * (email, analytics) share one vocabulary. Replies can be logged manually from day one.
 */
export const APPLICATION_STATUSES = [
  "saved",
  "preparing",
  "ready", // drafts generated, awaiting user approval
  "approved",
  "sent",
  "replied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const TRANSITIONS: Record<ApplicationStatus, readonly ApplicationStatus[]> = {
  saved: ["preparing", "withdrawn"],
  preparing: ["ready", "saved", "withdrawn"],
  ready: ["approved", "preparing", "withdrawn"],
  approved: ["sent", "ready", "withdrawn"],
  sent: ["replied", "interview", "rejected", "withdrawn"],
  replied: ["interview", "offer", "rejected", "withdrawn"],
  interview: ["offer", "rejected", "withdrawn"],
  offer: ["withdrawn"],
  rejected: [],
  withdrawn: [],
};

export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/** Only an explicit user approval can move an application to `approved` (no silent auto-send). */
export function requiresUserApproval(to: ApplicationStatus): boolean {
  return to === "approved";
}
