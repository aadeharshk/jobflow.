# API Reference (v0, Phase 3)

Base path: `/api`. JSON in and out. Authentication is a session cookie set by sign-in.
Every `POST`/`PATCH`/`DELETE` must come from the app's origin (`Origin` header, or `Sec-Fetch-Site: same-origin`), otherwise it gets `403`.

**Errors:** `{ "error": { "code": string, "message": string, "details"?: unknown } }`. Codes include `bad_request` (400), `unauthorized` (401), `forbidden` (403), `not_found` (404), `too_large` (413), `unsupported_type` (415), `rate_limited` (429), `misconfigured` (503), `internal` (500, includes `requestId`).

> An OpenAPI 3.1 document generated from the route schemas is planned for Phase 4 (see ADR-016). Until then this file is maintained by hand and verified by the integration tests in `worker/test/`.

## Health

| Method | Path      | Auth | Response                                              |
| ------ | --------- | ---- | ----------------------------------------------------- |
| GET    | `/health` | —    | `{ status, environment, checks: { dbCore, dbJobs } }` |

## Auth

| Method | Path                             | Auth     | Notes                                                                                              |
| ------ | -------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| GET    | `/auth/session`                  | optional | `{ user: User \| null }`                                                                           |
| GET    | `/auth/providers`                | —        | `{ google: boolean, devLogin: boolean }`                                                           |
| GET    | `/auth/google?returnTo=/app/...` | —        | 302 to Google (PKCE + state; scopes `openid email profile`). `returnTo` must be a relative path    |
| GET    | `/auth/google/callback`          | —        | 302 to `returnTo`, or `/signin?error=access_denied\|invalid_state\|oauth_failed\|email_unverified` |
| POST   | `/auth/dev-login`                | —        | `{ email, name? }`. Development/test only; 404 elsewhere                                           |
| POST   | `/auth/logout`                   | optional | Deletes the current session                                                                        |

Rate limit: 20 requests/minute per IP on `/auth/*` (Workers Rate Limiting, per location).

## Current user (`/me`, session required)

| Method | Path                         | Body / response                                                                                                                                  |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/me`                        | `{ user }`                                                                                                                                       |
| PATCH  | `/me`                        | `{ name?, country? (ISO-2), timezone? (IANA) }`, strict (unknown keys rejected)                                                                  |
| DELETE | `/me`                        | `{ confirmEmail }`. Permanently deletes the account, R2 files and DO state                                                                       |
| GET    | `/me/sessions`               | `{ sessions: [{ id (16-hex handle), current, createdAt, lastSeenAt, expiresAt, userAgent, country }] }`                                          |
| DELETE | `/me/sessions/:handle`       | Revokes one of _your_ sessions                                                                                                                   |
| POST   | `/me/sessions/revoke-others` | Signs out every other device                                                                                                                     |
| GET    | `/me/automation`             | `{ settings: { paused, followupsEnabled, dailyCap }, sending: { paused, dailyCap, sentInWindow, remaining, nextSlotAt }, platformDailyCap: 20 }` |
| PATCH  | `/me/automation`             | `{ paused?, followupsEnabled?, dailyCap? (0–20) }`                                                                                               |
| GET    | `/me/activity`               | Last 50 events                                                                                                                                   |
| GET    | `/me/export`                 | JSON download of all stored data (no secrets)                                                                                                    |

## Files (session required)

| Method | Path                          | Notes                                                                                                                   |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| GET    | `/files/resumes`              | `{ resumes: [{ id, filename, contentType, sizeBytes, createdAt }] }`                                                    |
| POST   | `/files/resumes`              | `multipart/form-data` field `file`; PDF (magic bytes checked), ≤ `MAX_RESUME_BYTES`, max 10 per user → `201 { resume }` |
| GET    | `/files/resumes/:id/download` | PDF stream, `Cache-Control: private, no-store`                                                                          |
| DELETE | `/files/resumes/:id`          | Deletes the R2 object and its metadata                                                                                  |

General API rate limit: 300 requests/minute per user.

## Background interfaces (not HTTP)

- **Queues:** versioned messages in `worker/src/queues/messages.ts` (`source.check`, `jobs.changed`, `email.send`, `inbox.sync`).
- **Cron:** `0 * * * *` (discovery scheduling; no-op until sources exist) and `30 3 * * *` (session/event retention).
- **Durable Object RPC:** `OutboundGovernor.reserve/confirm/release/status/configure/reset`, `SourceLimiter.configure/acquire`.
