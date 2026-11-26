# Database Schema & Migrations

JobFlow uses two Cloudflare D1 databases. SQL migrations are the **source of truth**. Drizzle schemas in `worker/src/db/` mirror them for typed queries, and `worker/test/platform.test.ts` verifies the mirror against the migrated database. All timestamps are Unix epoch **milliseconds** (UTC).

| Database       | Binding   | Purpose                                                       | Migrations         |
| -------------- | --------- | ------------------------------------------------------------- | ------------------ |
| `jobflow-core` | `DB_CORE` | Private user data                                             | `migrations/core/` |
| `jobflow-jobs` | `DB_JOBS` | Shared public job data (ingested once, matched for all users) | `migrations/jobs/` |

The split keeps each database under D1's 10 GB per-database limit and separates private from public data (ADR-004).

## `jobflow-core`

| Table                 | Key columns                                                                              | Notes                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `users`               | `id`, `email` (unique, case-insensitive), `role` (`user`/`admin`), `country`, `timezone` | Created on first verified sign-in                                                          |
| `oauth_accounts`      | `(provider, provider_user_id)` unique                                                    | External identities; **never stores tokens**                                               |
| `sessions`            | `id` = SHA-256(token), `expires_at`, `last_seen_at`                                      | Raw token only in the cookie; 30-day sliding expiry; expired rows purged daily             |
| `google_connections`  | `refresh_token_ciphertext`, `wrapped_data_key`, `key_version`, `history_id`              | Phase 6 (send-only). Envelope-encrypted; `history_id` reserved for future reply monitoring |
| `files`               | `r2_key` unique, `sha256`, `size_bytes`                                                  | Résumé metadata; bytes live in R2 at `users/{userId}/resumes/{fileId}.pdf`                 |
| `automation_settings` | `paused`, `followups_enabled`, `daily_cap` (CHECK 0–20)                                  | User guard rails; mirrored into the OutboundGovernor DO                                    |
| `audit_log`           | `action`, `target`, `metadata`                                                           | Security events; `user_id` set to NULL on account deletion                                 |
| `events`              | `name`, `props`                                                                          | First-party analytics and activity feed; kept ~13 months                                   |

All user-owned tables use `ON DELETE CASCADE`, so deleting a user row removes their data in one statement. R2 objects and Durable Object state are deleted by the API before that.

## `jobflow-jobs`

| Table             | Notes                                                                                                                                                                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sources`         | Registry of permitted sources. `access_method` ∈ `official_api`, `public_feed`, `public_page_robots_allowed`, `user_provided`. A CHECK makes it **impossible to enable a source without `terms_reviewed_at`**. `min_interval_minutes ≥ 15`; ETag/Last-Modified for conditional fetches |
| `companies`       | `domain` unique; `(ats_vendor, ats_slug)` unique                                                                                                                                                                                                                                       |
| `jobs`            | `(source_id, external_id)` unique; `content_hash` for change detection; `closed_at` for liveness; long descriptions can move to R2 (`description_key`)                                                                                                                                 |
| `public_contacts` | Only employer-published addresses, with mandatory `source_url` and `method` provenance                                                                                                                                                                                                 |

Phase 4 adds FTS5 search and Phase 5 adds match tables, each as **new** migrations.

## Durable Object storage (SQLite-backed)

| Class              | Instance key                    | Tables                                                                                                           |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `OutboundGovernor` | `user:{userId}`                 | `ledger(idempotency_key, kind, state, reserved_at, sent_at, provider_message_id)`, `settings(paused, daily_cap)` |
| `SourceLimiter`    | `source:{id}` / `domain:{host}` | `bucket(tokens, updated_at, rate_per_minute, burst)`                                                             |

## Working with migrations

```bash
npx wrangler d1 migrations create DB_CORE add_something   # creates migrations/core/000N_add_something.sql
npm run db:migrate:local                                   # apply to local Miniflare
npm run test:worker                                        # tests apply all migrations to fresh databases
npm run db:migrate:remote                                  # apply to production (done by the deploy workflow)
```

Rules: migrations are forward-only and additive (expand → migrate → contract across releases). Never edit an applied migration. D1 has no interactive transactions, so use `db.batch()` for atomic multi-statement writes. Recovery uses D1 Time Travel.
