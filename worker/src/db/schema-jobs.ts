/** Drizzle mirror of migrations/jobs/*.sql (shared public job data). */
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const sources = sqliteTable("sources", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  regions: text("regions").notNull().default("[]"),
  accessMethod: text("access_method", {
    enum: ["official_api", "public_feed", "public_page_robots_allowed", "user_provided"],
  }).notNull(),
  termsUrl: text("terms_url"),
  termsReviewedAt: integer("terms_reviewed_at"),
  minIntervalMinutes: integer("min_interval_minutes").notNull().default(60),
  nextCheckAt: integer("next_check_at").notNull().default(0),
  etag: text("etag"),
  lastModified: text("last_modified"),
  lastStatus: text("last_status"),
  lastCheckedAt: integer("last_checked_at"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
});

export const companies = sqliteTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain"),
  atsVendor: text("ats_vendor"),
  atsSlug: text("ats_slug"),
  careersUrl: text("careers_url"),
  country: text("country"),
  lastSeenAt: integer("last_seen_at"),
});

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  companyId: text("company_id"),
  externalId: text("external_id").notNull(),
  title: text("title").notNull(),
  normalizedTitle: text("normalized_title"),
  seniority: text("seniority"),
  employmentType: text("employment_type"),
  locations: text("locations").notNull().default("[]"),
  countries: text("countries").notNull().default("[]"),
  remoteType: text("remote_type", { enum: ["onsite", "hybrid", "remote"] }),
  salaryMin: real("salary_min"),
  salaryMax: real("salary_max"),
  salaryCurrency: text("salary_currency"),
  salaryPeriod: text("salary_period"),
  descriptionText: text("description_text"),
  descriptionKey: text("description_key"),
  applyUrl: text("apply_url").notNull(),
  postedAt: integer("posted_at"),
  firstSeenAt: integer("first_seen_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
  closedAt: integer("closed_at"),
  contentHash: text("content_hash").notNull(),
});

export const publicContacts = sqliteTable("public_contacts", {
  id: text("id").primaryKey(),
  companyId: text("company_id"),
  jobId: text("job_id"),
  email: text("email").notNull(),
  name: text("name"),
  role: text("role"),
  sourceUrl: text("source_url").notNull(),
  method: text("method", { enum: ["posting_text", "json_ld", "careers_page"] }).notNull(),
  capturedAt: integer("captured_at").notNull(),
});
