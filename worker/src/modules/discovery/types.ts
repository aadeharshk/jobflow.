/**
 * Discovery module contract (implemented in Phase 4).
 * Compliance is part of the type: an adapter cannot be registered without declaring
 * its access method, terms URL and review date.
 */
export type AccessMethod = "official_api" | "public_feed" | "public_page_robots_allowed" | "user_provided";

export interface SourceCompliance {
  accessMethod: AccessMethod;
  termsUrl: string;
  /** ISO date when a human reviewed the source's terms/robots policy. */
  termsReviewedOn: string;
  /** Sustained request budget allowed by the source. */
  rateLimit: { ratePerMinute: number; burst: number };
  /** Minimum minutes between full checks (≥ 60 means "hourly where permitted"). */
  minIntervalMinutes: number;
  attribution?: string;
}

export interface NormalizedJob {
  externalId: string;
  title: string;
  companyName: string;
  companyDomain?: string;
  locations: string[];
  countries: string[]; // ISO 3166-1 alpha-2, plus 'REMOTE'
  remoteType?: "onsite" | "hybrid" | "remote";
  employmentType?: string;
  salary?: { min?: number; max?: number; currency?: string; period?: "year" | "month" | "hour" };
  descriptionText?: string;
  applyUrl: string;
  postedAt?: number;
}

export interface FetchContext {
  fetch: typeof fetch;
  etag?: string | null;
  lastModified?: string | null;
  cursor?: string;
  userAgent: string;
}

export interface FetchResult {
  notModified: boolean;
  jobs: NormalizedJob[];
  etag?: string | null;
  lastModified?: string | null;
  nextCursor?: string;
}

export interface SourceAdapter {
  kind: string;
  displayName: string;
  /** Regions this adapter is most useful for (India-first, remote-global). */
  regions: string[];
  compliance: SourceCompliance;
  fetchJobs(sourceConfig: Record<string, unknown>, ctx: FetchContext): Promise<FetchResult>;
}
