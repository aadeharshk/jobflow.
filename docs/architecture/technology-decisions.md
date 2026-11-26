# Technology Decisions (Architecture Decision Records)

> Status: **Approved by the owner on 2026-11-26 (Phase 2 gate), with the decisions and amendments recorded at the end of this file.** Each ADR records context, decision, alternatives and consequences.

---

## ADR-001 — Cloudflare-only production infrastructure

**Context.** The brief requires Workers, Static Assets, D1, R2, Cron, Queues, Durable Objects and Secrets, and no Supabase/Firebase/Vercel/AWS/Railway/Render or external database.

**Decision.** A single Worker (TypeScript) provides `fetch` (API + static assets), `scheduled` (Cron) and `queue` handlers, and exports the Durable Object classes. Bindings: 2 × D1, 1 × R2, 4 queues + DLQs, 2 DO classes, Workers AI, the optional Browser Rendering binding, the Rate Limiting binding and Secrets.

**Alternatives.** Pages + Functions (superseded by Workers Static Assets for new projects). Separate Workers per concern (more deploy complexity for self-hosters).

**Consequences.** One `wrangler deploy`, one config file. CPU limits per invocation (5 min max, 15 min for hourly Cron) mean long work must be sliced into queue messages. D1's 10 GB per-database cap shapes the data model (ADR-004).

## ADR-002 — TypeScript everywhere; Hono + chanfana + Zod for the API

**Decision.** The API uses [Hono](https://github.com/honojs/hono) for routing and middleware, [chanfana](https://github.com/cloudflare/chanfana) for OpenAPI 3.1 generation, and [Zod](https://github.com/colinhacks/zod) for validation. The API reference in `docs/api/` is generated from code and never written by hand.

**Why.** Hono is Workers-first and permissively licensed (MIT), and one language across the stack lowers the barrier for contributors. Most job-domain reference code is Python (JobSpy, ats-scrapers, Resume-Matcher), but none of it runs on Workers. Porting the _logic_ to TS is the reuse path (see the matrix).

**Alternatives.** Rust (workers-rs: faster, but fewer contributors), itty-router (smaller ecosystem).

## ADR-003 — React SPA on Workers Static Assets

**Decision.** React 19 + Vite + React Router (SPA mode), Tailwind CSS v4 with design tokens, Radix UI primitives (accessible) and an in-repo component library, plus TanStack Query for data fetching. The marketing and landing pages are pre-rendered static HTML for SEO, served from the same assets directory.

**Why.** Static asset requests are free and unbilled on Workers (pricing appendix). The SPA keeps the Worker CPU budget for the API. Radix gives keyboard and screen-reader accessibility by default. Light and dark themes come from CSS variables.

**Alternatives.** React Router framework mode with SSR on Workers (adds CPU cost and complexity; revisit if SEO pages need dynamic data). Next.js (OpenNext adapter adds another layer).

## ADR-004 — D1 with Drizzle; split shared vs private data

**Decision.** Two D1 databases: `jobflow-jobs` (shared public job data) and `jobflow-core` (private user data). [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) handles schema and typed queries; drizzle-kit generates SQL migrations, applied with `wrangler d1 migrations apply`. FTS5 provides lexical search. Retention: closed jobs are compacted after 60 days (description moved to R2, embedding dropped); `matches` rows older than 30 days that the user never acted on are pruned.

**Scaling path.** At roughly 5,000+ active users, `jobflow-core` approaches the 10 GB per-database limit. The planned move is **per-user private data in SQLite-backed Durable Objects** (the same pattern as [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox)'s DO-per-mailbox), keeping only global indexes in D1. The alternative is hash-sharding `jobflow-core` across N D1 databases. This is decided at that milestone with real data.

**Alternatives.** Kysely + kysely-d1 (less migration tooling); raw SQL (more boilerplate); a Postgres via Hyperdrive (forbidden: external database).

## ADR-005 — Hybrid, explainable matching; embeddings in D1 first

**Decision.** Matching runs in four stages: hard filters, then FTS5 lexical skill and title overlap, then embedding cosine similarity (Workers AI `@cf/baai/bge-m3`, stored as BLOBs) over the remaining candidates, then an optional LLM rubric for the daily top 20. Each stage contributes a named component to a 0–100 score that the user can see and re-weight.

**Why.** Users trust rankings they can understand ("7/10 required skills matched"). Pure-LLM ranking is opaque, slow and costly. Pure keyword matching misses synonyms.

**Alternatives.** Cloudflare Vectorize (adopt when candidate sets exceed about 2,000 rows per query); external vector DB (forbidden).

## ADR-006 — AI provider abstraction via the Vercel AI SDK; Workers AI default

**Decision.** Use [`ai`](https://github.com/vercel/ai) (Apache-2.0) with `workers-ai-provider` as the default, so deployments run fully on Cloudflare with no extra keys. Users or self-hosters may plug in their own OpenAI/Anthropic/Google key (stored encrypted) for higher-quality drafting. All structured outputs use `generateObject` with Zod schemas.

**Default models (cost-aware):** `@cf/qwen/qwen3-30b-a3b-fp8` ($0.051/M input, $0.335/M output) for extraction, classification and drafting; `@cf/baai/bge-m3` ($0.012/M tokens) for embeddings. Models are configuration, not code.

**Guardrails.** Job descriptions and inbound emails are treated as untrusted data (prompt-injection isolation). A second "fact-check" pass rejects any generated claim not grounded in the confirmed profile.

## ADR-007 — Gmail via OAuth with incremental, minimal scopes

**Decision.**

- **Sign-in:** better-auth Google provider with `openid email profile` only.
- **Sending (incremental consent):** `https://www.googleapis.com/auth/gmail.send`.
- **Reply detection (incremental consent, separate toggle):** a read scope limited to thread and metadata checks. The candidates are `gmail.metadata` (headers only, enough for auto-reply/bounce detection but no body for classification) and `gmail.readonly` (needed to quote-strip and classify reply bodies). Proposal: start with `gmail.readonly` scoped in code to JobFlow-sent `threadId`s only, and document exactly what is read.
- **OAuth client library:** [arctic](https://github.com/pilcrowonpaper/arctic) (Google provider, PKCE, refresh). Gmail calls use `fetch` against the REST API. The `googleapis` Node package is avoided because it is Node-bound and heavy (research: [google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client)).
- **Change detection:** `users.history.list` polling from Cron every 10 minutes. `users.watch` push needs Google Cloud Pub/Sub, which would add non-Cloudflare infrastructure, so it is deferred.

**Policy constraint (important).** From the authors' knowledge of Google's policy, `gmail.send` is a _sensitive_ scope and `gmail.readonly` / `gmail.metadata` are _restricted_ scopes. A public app requesting restricted scopes must pass Google OAuth verification **and** an annual third-party security assessment (CASA). Until then, an unverified app is limited to a small number of test users. _These Google pages could not be fetched from the research environment (network allow-list), so the classification must be re-confirmed on Google's official scope documentation before Phase 4._

**Consequences / strategy.**

1. **Self-hosted users** create their own Google Cloud OAuth client (a step-by-step guide will ship in the docs). For personal use no verification is needed. This makes the open-source edition fully functional from day one.
2. **The hosted JobFlow edition** launches send-only (sensitive scope, lighter verification) with _manual_ reply logging. Automated reply detection is enabled once restricted-scope verification and the security assessment are complete. Budget time (weeks) and money for this.
3. All token handling follows the envelope-encryption design in the system architecture.

## ADR-008 — Durable Objects for the outbound governor and source limiter

**Decision.**

- `OutboundGovernor` (one per user, SQLite-backed) holds the rolling 24-hour send ledger, the pause flag, idempotency keys and follow-up alarms. It serialises every send.
- `SourceLimiter` (one per source or domain) is a token bucket that enforces documented API limits and crawl politeness.

**Why.** The 20-messages-per-rolling-24-hours rule is a hard product promise. D1 has no row locking or interactive transactions, so concurrent queue consumers could race past the cap. A DO is single-threaded per ID, so the check-and-append is atomic. Alarms give precise follow-up timing without polling. DO duration is not billed while hibernation-eligible.

**Alternatives.** The Cloudflare Agents SDK `Agent` class (a DO with scheduling helpers). It is acceptable if it reduces code; the decision is deferred to implementation and pinned if used.

## ADR-009 — Queues for all background work, with dead-letter queues

**Decision.** Four queues (`discovery`, `enrich-match`, `outbound`, `inbox-sync`), each with a DLQ, `max_retries=3` and exponential backoff via `retryDelay`. Every message carries an idempotency key; consumers are idempotent (upserts keyed by content hash or external ID).

**Why.** Cron handlers must stay small. Queues give retries, batching and isolation between noisy discovery work and latency-sensitive sends.

## ADR-010 — Compliance-first source policy

**Decision.** A job source may be enabled only if:

- its access method is an **official API, a published public feed, or a public page that robots.txt permits**;
- its terms were reviewed (`terms_reviewed_at`, `terms_url`); and
- its rate limits are encoded in `SourceLimiter`.

LinkedIn is supported only through user-provided URLs and the user's own LinkedIn job-alert emails, with consent. JobFlow does not scrape LinkedIn, drive logged-in sessions, use stealth browsers or solve CAPTCHAs. Third-party application forms are never submitted automatically.

**Why.** Research shows the most-starred "auto-apply" projects are built on exactly these prohibited techniques (for example `undetected-chromedriver`, LinkedIn guest-endpoint scraping, and the cloakbrowser fingerprint bypass), which exposes users to account bans and the project to takedowns. Compliance is a product differentiator for JobFlow: it is the trustworthy option.

## ADR-011 — Testing & quality gates

**Decision.**

- Vitest with `@cloudflare/vitest-pool-workers` for unit and integration tests inside the real Workers runtime, with local D1, R2, Queues and DO.
- Recorded fixtures for every source adapter and Gmail call; no live network in CI.
- Playwright E2E against `wrangler dev`.
- ESLint + TypeScript `strict`, `tsc --noEmit` in CI.
- Security: `npm audit`, GitHub dependency review, CodeQL and secret scanning.
- Coverage threshold of 80% on `discovery/`, `matching/`, `email/` and `governor/` (the governor's 20/24h rule gets property-based tests).

## ADR-012 — Licence for JobFlow itself

**Recommendation:** **Apache-2.0.**

**Why.**

- Every proposed dependency is MIT or Apache-2.0, so they are compatible.
- Apache-2.0's explicit patent grant reassures companies and contributors.
- It maximises adoption, stars and contributions, and other developers can deploy JobFlow to their own Cloudflare accounts.
- Attribution requirements of adapted MIT/Apache code are met through `THIRD_PARTY_NOTICES.md`.

**Alternative:** AGPL-3.0, if Harsh wants to stop competitors from running a closed hosted fork. The trade-off is lower corporate contribution and lower adoption. The commercial edge for the hosted product then comes from operations, Google verification, brand and data quality, not from code secrecy. **Owner decision required.**

## ADR-013 — Product analytics without third-party trackers

**Decision.** First-party `events` in D1 for activation and retention (`signed_up`, `profile_confirmed`, `first_match_viewed`, `gmail_connected`, `application_approved`, `email_sent`, `reply_received`, `interview_detected`, weekly active), and Cloudflare Web Analytics (cookieless) for the landing page. There is an optional Workers Analytics Engine sink for high-volume counters. No third-party trackers in the app.

---

## Open questions for approval

1. Licence: Apache-2.0 (recommended) or AGPL-3.0?
2. Hosted edition at launch: send-only with manual reply logging until Google restricted-scope verification is done? (Recommended.)
3. Initial geographic focus for curated company seeding: India + remote-global first (fits the founder network and UPNXTWork), then the US/EU?
4. Product name: keep "JobFlow"? (The name is common. A trademark and domain check is recommended before launch; see `launch-and-growth-strategy.md`.)

---

## Decisions recorded at the Phase 2 gate (2026-11-26)

| Question                     | Owner decision                                                                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Licence                      | **Apache-2.0** (ADR-012 accepted). `LICENSE`, `NOTICE` and `THIRD_PARTY_NOTICES.md` added                                                                                    |
| Hosted Gmail scope at launch | **Send-only.** Replies are logged manually at first. Restricted Gmail scopes and Google verification are **not** launch dependencies (ADR-007 amended below)                 |
| Target market                | **India + remote-global first**; source architecture stays country-extensible                                                                                                |
| Branding                     | Run a preliminary trademark/domain check; keep "JobFlow" provisional; buy nothing until approved. Result: [`../product/brand-name-check.md`](../product/brand-name-check.md) |

## ADR-007 (amended) — Send-only Gmail at launch

The launch scope is `gmail.send` only (sensitive, not restricted), requested incrementally in Phase 6. Application status after sending (replied, interview, rejected) is updated **manually** by the user. The architecture keeps reply monitoring possible later without migrations or redesign:

- `google_connections.history_id`, the `jobflow-inbox-sync` queue, the `inbox.sync` message contract and the `handleInboxSync` hook exist but are disabled.
- Enabling monitoring later only needs incremental consent for a read scope, completed Google verification, and implementing the hook.

## ADR-014 — Authentication implemented with arctic + first-party sessions (amends ADR-002/ADR-007's better-auth choice)

**Context.** ADR-002 proposed better-auth. During Phase 3, the requirements turned out to be narrow: Google is the only identity provider, Gmail needs separate incremental consent later, and everything must run on Workers with no Node.js dependencies.

**Decision.** Use [arctic](https://github.com/pilcrowonpaper/arctic) (MIT) for the Google OIDC authorization-code + PKCE flow, plus about 150 lines of first-party session code. Sessions are random 256-bit tokens, only their SHA-256 hash is stored in D1, cookies are `HttpOnly`/`SameSite=Lax`/`__Host-` and expiry is sliding. Ownership of incremental Gmail scopes stays explicit in our code.

**Why.** It is a smaller dependency and attack surface, every security property is visible and unit-tested (`worker/test/auth.test.ts`), there is no ORM adapter layer to keep in sync with D1, and Phase 6 needs full control over token storage (envelope encryption).

**Trade-off.** We maintain session code ourselves. Mitigation: the logic follows the widely reviewed Lucia/Copenhagen-book session pattern and is covered by tests (hashing, expiry, forgery, revocation, CSRF, open-redirect, OAuth state).

## ADR-015 — Workers test runner: `@cloudflare/vitest-plugin`

`@cloudflare/vitest-pool-workers` is deprecated and renamed to `@cloudflare/vitest-plugin`. Tests run inside workerd/Miniflare with real D1, R2, Queues and Durable Objects, and migrations are applied per run.

## ADR-016 — OpenAPI generation deferred to Phase 4

chanfana (ADR-002) is not adopted yet. Phase 3's 18 routes are validated with Zod via `@hono/zod-validator` and documented by hand in `docs/api/README.md`, with behaviour pinned by integration tests. In Phase 4, when public job-search endpoints arrive, routes move to a schema-first definition that generates OpenAPI 3.1 (chanfana or `@hono/zod-openapi`, chosen then).

## ADR-017 — Toolchain pins and supply-chain hygiene

- **npm 11.21.2** is required. npm 10.9 crashes (`Cannot read properties of null (reading 'edgesOut')`) when resolving vitest 4 peer dependencies. CI installs the pinned npm version.
- All dependencies are exact-pinned. The selection rule is a release at least 14 days old. The one exception is `typescript-eslint` 8.74.0 (released 2026-11-23), adopted because it fixes a moderate ReDoS advisory (GHSA-g3hv-75wg-m249) in its `minimatch` dependency.
- npm `allowScripts` permits install scripts only for `esbuild` and `workerd`.
- GitHub Actions are pinned to full commit SHAs. Dependabot keeps them current.
