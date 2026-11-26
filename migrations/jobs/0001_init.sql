-- JobFlow jobs database (shared, public-source data). Timestamps are Unix epoch milliseconds (UTC).
PRAGMA foreign_keys = ON;

-- Source registry. A source can only be enabled after its terms are reviewed (enforced in code + CHECK).
CREATE TABLE sources (
  id                   TEXT PRIMARY KEY,           -- e.g. 'greenhouse', 'adzuna-in'
  kind                 TEXT NOT NULL,              -- adapter key
  name                 TEXT NOT NULL,
  regions              TEXT NOT NULL DEFAULT '[]', -- JSON array of ISO country codes or 'REMOTE'
  access_method        TEXT NOT NULL CHECK (access_method IN ('official_api', 'public_feed', 'public_page_robots_allowed', 'user_provided')),
  terms_url            TEXT,
  terms_reviewed_at    INTEGER,
  min_interval_minutes INTEGER NOT NULL DEFAULT 60 CHECK (min_interval_minutes >= 15),
  next_check_at        INTEGER NOT NULL DEFAULT 0,
  etag                 TEXT,
  last_modified        TEXT,
  last_status          TEXT,
  last_checked_at      INTEGER,
  enabled              INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  CHECK (enabled = 0 OR terms_reviewed_at IS NOT NULL)
);
CREATE INDEX idx_sources_due ON sources(enabled, next_check_at);

CREATE TABLE companies (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  domain       TEXT UNIQUE,
  ats_vendor   TEXT,
  ats_slug     TEXT,
  careers_url  TEXT,
  country      TEXT,
  last_seen_at INTEGER,
  UNIQUE (ats_vendor, ats_slug)
);

CREATE TABLE jobs (
  id               TEXT PRIMARY KEY,
  source_id        TEXT NOT NULL REFERENCES sources(id),
  company_id       TEXT REFERENCES companies(id),
  external_id      TEXT NOT NULL,
  title            TEXT NOT NULL,
  normalized_title TEXT,
  seniority        TEXT,
  employment_type  TEXT,
  locations        TEXT NOT NULL DEFAULT '[]',  -- JSON
  countries        TEXT NOT NULL DEFAULT '[]',  -- JSON ISO codes
  remote_type      TEXT CHECK (remote_type IN ('onsite', 'hybrid', 'remote') OR remote_type IS NULL),
  salary_min       REAL,
  salary_max       REAL,
  salary_currency  TEXT,
  salary_period    TEXT,
  description_text TEXT,
  description_key  TEXT,                         -- R2 key for full HTML
  apply_url        TEXT NOT NULL,
  posted_at        INTEGER,
  first_seen_at    INTEGER NOT NULL,
  last_seen_at     INTEGER NOT NULL,
  closed_at        INTEGER,
  content_hash     TEXT NOT NULL,
  UNIQUE (source_id, external_id)
);
CREATE INDEX idx_jobs_open_recent ON jobs(closed_at, posted_at DESC);
CREATE INDEX idx_jobs_company ON jobs(company_id);

-- Public hiring contacts. Only addresses published by the employer, always with provenance.
CREATE TABLE public_contacts (
  id          TEXT PRIMARY KEY,
  company_id  TEXT REFERENCES companies(id),
  job_id      TEXT REFERENCES jobs(id),
  email       TEXT NOT NULL,
  name        TEXT,
  role        TEXT,
  source_url  TEXT NOT NULL,
  method      TEXT NOT NULL CHECK (method IN ('posting_text', 'json_ld', 'careers_page')),
  captured_at INTEGER NOT NULL
);
CREATE INDEX idx_contacts_company ON public_contacts(company_id);
