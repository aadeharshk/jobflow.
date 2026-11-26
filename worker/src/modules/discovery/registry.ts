import type { SourceAdapter, AccessMethod } from "./types";

const ALLOWED_ACCESS: readonly AccessMethod[] = ["official_api", "public_feed", "public_page_robots_allowed", "user_provided"];

/** Hosts JobFlow will never fetch automatically (terms prohibit automated access). */
export const BLOCKED_HOSTS = ["linkedin.com", "www.linkedin.com", "glassdoor.com", "www.glassdoor.com", "indeed.com", "www.indeed.com"];

export class ComplianceError extends Error {}

/** Throws unless the adapter declares a compliant, reviewed access method. */
export function assertCompliant(adapter: SourceAdapter): void {
  const c = adapter.compliance;
  if (!ALLOWED_ACCESS.includes(c.accessMethod)) throw new ComplianceError(`${adapter.kind}: access method not allowed`);
  if (!/^https:\/\//.test(c.termsUrl)) throw new ComplianceError(`${adapter.kind}: termsUrl must be an https URL`);
  if (Number.isNaN(Date.parse(c.termsReviewedOn))) throw new ComplianceError(`${adapter.kind}: termsReviewedOn must be an ISO date`);
  if (!(c.rateLimit.ratePerMinute > 0) || !(c.rateLimit.burst >= 1)) throw new ComplianceError(`${adapter.kind}: rate limit required`);
  if (c.minIntervalMinutes < 15) throw new ComplianceError(`${adapter.kind}: minIntervalMinutes must be ≥ 15`);
}

export function isBlockedHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return BLOCKED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return true;
  }
}

/** Phase 4 registers adapters here (Greenhouse, Lever, Ashby, … + India-focused APIs). */
const adapters = new Map<string, SourceAdapter>();

export function registerAdapter(adapter: SourceAdapter): void {
  assertCompliant(adapter);
  if (adapters.has(adapter.kind)) throw new Error(`adapter ${adapter.kind} already registered`);
  adapters.set(adapter.kind, adapter);
}

export function getAdapter(kind: string): SourceAdapter | undefined {
  return adapters.get(kind);
}

export function listAdapters(): SourceAdapter[] {
  return [...adapters.values()];
}
