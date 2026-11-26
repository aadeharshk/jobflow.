# Phase 3 Report: Foundation

**Status:** complete, awaiting owner review. Phase 4 has **not** been started.
**Date:** 2026-11-26

## Delivered

| Requirement                                                   | Delivered                                                                                                                                      | Evidence                                                                           |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Project skeleton on the approved Cloudflare architecture      | One Worker (Hono API + Workers Static Assets SPA), modular `worker/src/modules/*`                                                              | `wrangler.jsonc`, `worker/src/app.ts`                                              |
| Authentication                                                | Google OIDC (PKCE, state, sign-in scopes only) via arctic; hashed-token sessions; sliding expiry; logout; dev login (dev/test only)            | `worker/src/modules/auth/*`, `auth.test.ts`                                        |
| User management                                               | Profile update, session list/revoke/revoke-others, activity feed, data export, account deletion, admin role column + `requireAdmin` guard      | `modules/users/routes.ts`, `users.test.ts`                                         |
| Database migrations                                           | `migrations/core/0001_init.sql`, `migrations/jobs/0001_init.sql`; Drizzle mirrors verified by tests                                            | `docs/architecture/database.md`                                                    |
| D1, R2, Queues, Workers, Durable Objects                      | 2 × D1, R2 résumé storage, 4 queues + DLQ with versioned contracts, `OutboundGovernor` + `SourceLimiter` DOs, 2 Cron Triggers, Rate Limiting   | `durable-objects.test.ts`, `files.test.ts`, `platform.test.ts`                     |
| Secure environment & secrets                                  | Zod-validated, fail-closed config; Cloudflare Secrets; envelope encryption ready for OAuth tokens; `.dev.vars.example`                         | `worker/src/env.ts`, `lib/crypto.ts`, `docs/deployment/secrets-and-environment.md` |
| GitHub Actions, CI, tests                                     | CI (lint, format, typecheck, unit, E2E, build, audit, dependency review), CodeQL, gated deploy workflow, Dependabot                            | `.github/workflows/*`                                                              |
| Deployment documentation + checklist                          | Guide, checklist, setup script, rollback, troubleshooting                                                                                      | `docs/deployment/*`, `scripts/setup-cloudflare.sh`                                 |
| Modular architecture                                          | Discovery (compliance-typed adapters + registry), matching (score contract), email (send-only provider contract), applications (state machine) | `worker/src/modules/*`                                                             |
| Costs & free-tier limits documented; paid features identified | Per-feature table with which phase needs Workers Paid, Workers AI or Browser Rendering                                                         | `docs/architecture/free-tier-and-paid-features.md`                                 |
| Licence                                                       | Apache-2.0 + NOTICE + third-party notices                                                                                                      | `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`                                      |
| Brand check                                                   | Preliminary check: "JobFlow" is high-risk (same-category projects, GitHub org and npm scope taken); alternatives screened                      | `docs/product/brand-name-check.md`                                                 |

## Verification (run on 2026-11-26)

| Check                                                                          | Result                        |
| ------------------------------------------------------------------------------ | ----------------------------- |
| `npm run lint` (ESLint, zero warnings allowed)                                 | ✅ pass                       |
| `npm run format:check` (Prettier)                                              | ✅ pass                       |
| `npm run typecheck` (worker, web, tests; `strict`, `noUncheckedIndexedAccess`) | ✅ pass                       |
| `npm run test:worker` (inside workerd/Miniflare)                               | ✅ **70/70**                  |
| `npm run test:web` (jsdom)                                                     | ✅ **6/6**                    |
| `npm run test:e2e` (Playwright, desktop + mobile, real `wrangler dev`)         | ✅ **8/8**                    |
| `npm run build` (SPA + `wrangler deploy --dry-run`, production and staging)    | ✅ pass; all bindings resolve |
| `npm audit` (all and production dependencies)                                  | ✅ 0 vulnerabilities          |

**Not verified:** an actual deployment to a Cloudflare account. This environment has no Cloudflare credentials. Google OAuth was tested up to the redirect and callback validation; a real Google round-trip needs your OAuth client. Both are items on the deployment checklist.

## Security review (self-review against OWASP ASVS L1 themes)

| Area               | Control                                                                                                                                             | Tested                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Session management | 256-bit random tokens, SHA-256 at rest, `HttpOnly`, `SameSite=Lax`, `__Host-`/`Secure` on HTTPS, expiry + revocation                                | ✅                      |
| CSRF               | Origin / Fetch-Metadata check on all unsafe methods, all content types                                                                              | ✅                      |
| OAuth              | PKCE S256, state in an httpOnly cookie compared in constant time, verified-email requirement, open-redirect-safe `returnTo`                         | ✅                      |
| Access control     | Every user resource query is scoped by `user_id`; cross-user download and delete return 404                                                         | ✅                      |
| Input validation   | Strict Zod schemas (unknown keys rejected), ISO country, IANA time zone, PDF magic bytes, filename sanitisation, size/count limits                  | ✅                      |
| Secrets            | Fail-closed config; dev login impossible in staging/production; no secrets in repo/CI                                                               | ✅                      |
| Crypto             | AES-256-GCM envelope encryption with AAD binding; tamper, wrong-key and cross-user decryption all fail                                              | ✅                      |
| Headers            | API: CSP `default-src 'none'`, `no-store`, `nosniff`, `DENY`, HSTS (HTTPS). SPA: strict CSP without `unsafe-inline`, HSTS, COOP, Permissions-Policy | ✅ (E2E checks the CSP) |
| Abuse              | Rate Limiting binding on auth/API; 20/24h governor proven under 35 concurrent requests                                                              | ✅                      |
| Privacy            | Data export; deletion of D1, R2 and DO state; de-identified audit log; first-party analytics only                                                   | ✅                      |
| Compliance         | DB CHECK blocks enabling unreviewed sources and non-permitted access methods; LinkedIn/Indeed/Glassdoor blocked hosts                               | ✅                      |
| Supply chain       | Exact pins, `allowScripts` allow-list, SHA-pinned Actions, audit, CodeQL, dependency review with licence deny-list                                  | CI                      |

## Known limitations

1. **No live deployment yet.** You need to run the deployment checklist with your Cloudflare account and Google OAuth client.
2. **Rate Limiting binding** counters are per Cloudflare location and best-effort. That is fine as abuse protection, not as an exact quota. Availability on the Free plan was not verified in-session.
3. **OpenAPI** generation is deferred to Phase 4 (ADR-016); the API is documented by hand and pinned by tests.
4. **Upload size** is checked from `Content-Length` and after parsing. A chunked upload without `Content-Length` is read into memory before rejection (bounded by Workers' platform request limit). A streaming size guard is planned.
5. **Worker bundle** is about 1.1 MB uncompressed (about 190 KB gzipped with assets), well inside limits. It will be watched as features are added.
6. **Brand:** "JobFlow" carries a high confusion risk; trademark and domain checks need a manual search (sites are unreachable from this environment).
7. **Email/Gmail:** intentionally not implemented (Phase 6). The outbound queue consumer refuses to send.
8. **Durable Object CPU on Free plan:** the 10 ms CPU per invocation has not been measured on real infrastructure.

## Ready for Phase 4 (on approval)

Résumé parsing (unpdf + Workers AI, user-confirmed profile), the first compliant source adapters (India-first + remote-global: public ATS APIs and permitted job APIs), FTS5 search UI, and OpenAPI generation.
