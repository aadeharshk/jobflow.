# Cloudflare Infrastructure References

> Metrics checked on **2026-11-26** via the GitHub REST search API and shallow, blob-less git clones of each repository. Stars/forks/issues change daily; re-run `scripts/research/` (see methodology) to refresh.

Reference repositories for Workers, D1, R2, Queues, Durable Objects, auth and API tooling. Pricing facts used by `docs/architecture/cloudflare-cost-analysis.md` are listed in the appendix below.


## Selection methodology

1. **Discovery (breadth).** 62 GitHub repository-search queries (25 results each, sorted by stars) covering every category in the brief returned **1,382 unique repositories**. Raw results are kept outside the repo; queries are listed in `docs/research/repository-comparison-matrix.md` § Reproducing.
2. **Curation (relevance).** Off-topic hits (e.g. keyword collisions such as OpenWrt configs, political repos, Android JobScheduler) were discarded. Well-known projects named in the brief or known to the field (Nodemailer, Mailparser, ImapFlow, EmailEngine, Postal, Listmonk, n8n, Google API clients, Resume-Matcher, Reactive Resume, Hono, Drizzle …) were added by exact `repo:` lookup.
3. **Verification.** Stars, forks, open issues (GitHub counts issues + PRs), licence, language, archive status and dates come from the GitHub API on the check date. Each repository was shallow-cloned (tree only) to count test files, CI workflows, SECURITY/CONTRIBUTING files, lockfiles and dependency bots, and to read `package.json` / `requirements.txt` / `pyproject.toml`. Licences reported as `NOASSERTION` by GitHub were confirmed by reading the LICENSE file. Key reuse candidates had source files read directly (e.g. JobSpy's LinkedIn module, ats-scrapers' Greenhouse and cloakbrowser modules, worker-mailer, jobber, agentic-inbox, inbox-zero's Gmail utilities).
4. **Scoring (100 points).**

| Criterion | Weight | How it was scored |
|---|---:|---|
| Functionality & relevance to JobFlow | 20 | Analyst judgement after reading README/code |
| Code quality & architecture | 15 | Analyst judgement: structure, typing, modularity, tests observed |
| Maintenance & recent activity | 15 | Computed from last commit: ≤30d 15 · ≤90d 12 · ≤180d 9 · ≤365d 6 · ≤730d 3 · older 1 · archived 0 |
| Licence & reuse suitability | 15 | Computed: permissive (MIT/Apache/BSD/ISC/CC0) 15 · permissive with `ee/` carve-outs 12 · LGPL/MPL 10 · GPL 6 · AGPL 4 · source-available/non-commercial 2 · no licence 0 |
| Security & privacy | 10 | Analyst judgement: ToS compliance, credential handling, evasion tooling, data minimisation |
| Documentation & testing | 10 | Computed: test files (0/1–9/10–49/50+ → 0/2/4/5) + CI 2 + CONTRIBUTING/docs 1 + SECURITY.md 1 + CHANGELOG 1 |
| Cloudflare compatibility | 10 | Analyst judgement: Web-standard APIs, Node/Python dependencies, long-lived sockets |
| Community adoption | 5 | Computed from stars: ≥20k 5 · ≥5k 4 · ≥1k 3 · ≥200 2 · ≥50 1 |

### Ranking limitations (read before relying on the scores)

- These are **not** "the world's top 50" repositories. They are the most relevant repositories this method found on the check date. GitHub search ranks by keyword match plus stars, so good projects with unusual names can be missed.
- Four of the eight criteria (45 points) are analyst judgements. They are explained per repository, but another reviewer could reasonably move a score by ±3–5 points.
- Star counts can be inflated and say little about quality. They carry only 5 points for that reason.
- Test-file counts are heuristic: they count files matching test naming patterns, not coverage.
- Repositories that automate LinkedIn or evade bot detection appear here so they can be rejected **explicitly**. A high score in other columns never overrides a compliance failure. Look at the **Decision** column, not just the total.
- "Decision" values: **Reuse** = take as a dependency; **Adapt** = port a specific, permissively licensed pattern or code with attribution; **Reference** = study the design only, copy no code; **Avoid** = do not use.


## Ranked results

| # | Repository | Score | Rel /20 | Code /15 | Maint /15 | Licence /15 | Sec /10 | Docs+Tests /10 | CF /10 | Adopt /5 | Decision |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | [cloudflare/workers-sdk](https://github.com/cloudflare/workers-sdk) | **94** | 18 | 14 | 15 | 15 | 9 | 10 | 10 | 3 | Reuse (tooling) |
| 2 | [honojs/hono](https://github.com/honojs/hono) | **94** | 18 | 14 | 15 | 15 | 9 | 8 | 10 | 5 | Reuse (dependency) |
| 3 | [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) | **93** | 17 | 13 | 15 | 15 | 8 | 10 | 10 | 5 | Reuse (dependency) |
| 4 | [better-auth/better-auth](https://github.com/better-auth/better-auth) | **92** | 16 | 13 | 15 | 15 | 9 | 10 | 9 | 5 | Reuse (dependency) |
| 5 | [cloudflare/workerd](https://github.com/cloudflare/workerd) | **90** | 12 | 15 | 15 | 15 | 9 | 10 | 10 | 4 | Reference |
| 6 | [cloudflare/cloudflare-docs](https://github.com/cloudflare/cloudflare-docs) | **86** | 14 | 10 | 15 | 15 | 9 | 9 | 10 | 4 | Reference |
| 7 | [cloudflare/templates](https://github.com/cloudflare/templates) | **85** | 15 | 11 | 15 | 15 | 8 | 8 | 10 | 3 | Adapt |
| 8 | [kysely-org/kysely](https://github.com/kysely-org/kysely) | **85** | 12 | 13 | 15 | 15 | 9 | 9 | 8 | 4 | Reference |
| 9 | [cloudflare/chanfana](https://github.com/cloudflare/chanfana) | **84** | 14 | 12 | 15 | 15 | 8 | 8 | 10 | 2 | Reuse (dependency) |
| 10 | [cloudflare/workers-oauth-provider](https://github.com/cloudflare/workers-oauth-provider) | **82** | 10 | 11 | 15 | 15 | 9 | 9 | 10 | 3 | Reference |
| 11 | [ottabase/ottabase](https://github.com/ottabase/ottabase) | **79** | 11 | 10 | 15 | 15 | 8 | 10 | 10 | 0 | Reference |
| 12 | [cloudflare/workers-rs](https://github.com/cloudflare/workers-rs) | **77** | 6 | 12 | 15 | 15 | 9 | 7 | 10 | 3 | Avoid |
| 13 | [elliothux/open-compute](https://github.com/elliothux/open-compute) | **77** | 8 | 11 | 15 | 15 | 8 | 10 | 7 | 3 | Reference |
| 14 | [zpg6/better-auth-cloudflare](https://github.com/zpg6/better-auth-cloudflare) | **75** | 12 | 9 | 12 | 15 | 7 | 8 | 10 | 2 | Reference |
| 15 | [G4brym/workers-qb](https://github.com/G4brym/workers-qb) | **73** | 10 | 9 | 12 | 15 | 7 | 8 | 10 | 2 | Reference |
| 16 | [cloudflare/playwright](https://github.com/cloudflare/playwright) | **66** | 10 | 13 | 0 | 15 | 8 | 9 | 10 | 1 | Reuse (optional) |
| 17 | [G4brym/workers-research](https://github.com/G4brym/workers-research) | **64** | 9 | 9 | 6 | 15 | 7 | 7 | 10 | 1 | Reference |
| 18 | [mirza-rizvi/ResolveHQ](https://github.com/mirza-rizvi/ResolveHQ) | **64** | 11 | 10 | 12 | 2 | 8 | 9 | 10 | 2 | Reference (licence) |
| 19 | [cloudflare/actors](https://github.com/cloudflare/actors) | **63** | 9 | 9 | 6 | 15 | 7 | 5 | 10 | 2 | Reference |
| 20 | [supermemoryai/backend-api-kit](https://github.com/supermemoryai/backend-api-kit) | **55** | 9 | 7 | 3 | 15 | 6 | 3 | 10 | 2 | Reference |
| 21 | [aidenwallis/kysely-d1](https://github.com/aidenwallis/kysely-d1) | **54** | 8 | 7 | 3 | 15 | 7 | 2 | 10 | 2 | Reference |
| 22 | [cloudflare/queues-web-crawler](https://github.com/cloudflare/queues-web-crawler) | **54** | 11 | 7 | 0 | 15 | 8 | 2 | 10 | 1 | Adapt |

**Total repositories evaluated in this report: 22.**


## Repository details

### 1. [cloudflare/workers-sdk](https://github.com/cloudflare/workers-sdk) — 94/100

- **Purpose:** Wrangler CLI, Miniflare, Vitest pool, create-cloudflare
- **GitHub description:** ⛅️ Home to Wrangler, the CLI for Cloudflare Workers®
- **Stars / forks / open issues+PRs:** 4,751 / 1,677 / 366 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2021-11-10
- **Primary language / detected stack:** TypeScript / Wrangler
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Workers platform
- **Engineering signals:** 5977 files · 1554 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Official
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Local dev, D1 migrations, vitest-pool-workers testing
- **Limitations / reasons not to reuse:** —
- **Decision:** **Reuse (tooling)**

### 2. [honojs/hono](https://github.com/honojs/hono) — 94/100

- **Purpose:** Ultrafast Web-standard router, first-class on Workers
- **GitHub description:** Web framework built on Web Standards
- **Stars / forks / open issues+PRs:** 33,088 / 1,502 / 375 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2021-12-14
- **Primary language / detected stack:** TypeScript / Hono
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 590 files · 181 test files · 7 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; widely adopted
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** API routing, middleware (CORS, secure headers, CSRF, rate limiting hooks)
- **Limitations / reasons not to reuse:** —
- **Decision:** **Reuse (dependency)**

### 3. [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) — 93/100

- **Purpose:** Type-safe TypeScript ORM with D1 driver and migrations
- **GitHub description:** ORM
- **Stars / forks / open issues+PRs:** 36,395 / 1,800 / 2,086 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-13 (13 days before check) · created 2021-06-24
- **Primary language / detected stack:** TypeScript / Drizzle
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** D1, SQLite
- **Engineering signals:** 1394 files · 251 test files · 6 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Schema definitions, typed queries, drizzle-kit migrations for D1
- **Limitations / reasons not to reuse:** Some D1 limitations (no interactive transactions — use batch)
- **Decision:** **Reuse (dependency)**

### 4. [better-auth/better-auth](https://github.com/better-auth/better-auth) — 92/100

- **Purpose:** Framework-agnostic TS auth: sessions, OAuth, rate limiting
- **GitHub description:** The most comprehensive authentication framework
- **Stars / forks / open issues+PRs:** 30,893 / 3,116 / 986 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2024-05-19
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Google OAuth etc.; Drizzle adapter
- **Engineering signals:** 2514 files · 708 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; 708 tests; SECURITY.md
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** Session management + Google sign-in on D1 via Drizzle adapter
- **Limitations / reasons not to reuse:** Gmail API scopes/tokens still need dedicated encrypted storage
- **Decision:** **Reuse (dependency)**

### 5. [cloudflare/workerd](https://github.com/cloudflare/workerd) — 90/100

- **Purpose:** Open-source Workers runtime
- **GitHub description:** The JavaScript / Wasm runtime that powers Cloudflare Workers
- **Stars / forks / open issues+PRs:** 9,272 / 847 / 940 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2022-09-15
- **Primary language / detected stack:** C++ / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** —
- **Engineering signals:** 4997 files · 2142 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Official
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Runtime behaviour reference
- **Limitations / reasons not to reuse:** —
- **Decision:** **Reference**

### 6. [cloudflare/cloudflare-docs](https://github.com/cloudflare/cloudflare-docs) — 86/100

- **Purpose:** Official Cloudflare documentation source
- **GitHub description:** Cloudflare’s documentation
- **Stars / forks / open issues+PRs:** 5,524 / 17,573 / 486 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2020-09-03
- **Primary language / detected stack:** MDX / React, Wrangler
- **Licence:** CC-BY-4.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** —
- **Engineering signals:** 14527 files · 102 test files · 12 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Official
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Limits/pricing/config references (cited in docs)
- **Limitations / reasons not to reuse:** —
- **Decision:** **Reference**

### 7. [cloudflare/templates](https://github.com/cloudflare/templates) — 85/100

- **Purpose:** Official Workers templates (React+Vite SPA, D1, R2, Queues, DO)
- **GitHub description:** Templates for Cloudflare Workers
- **Stars / forks / open issues+PRs:** 2,181 / 1,083 / 114 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-18 (8 days before check) · created 2017-12-19
- **Primary language / detected stack:** TypeScript / Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Workers platform
- **Engineering signals:** 980 files · 86 test files · 8 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Official
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** React SPA + Worker API + D1 starter structure
- **Limitations / reasons not to reuse:** Templates vary in testing depth
- **Decision:** **Adapt**

### 8. [kysely-org/kysely](https://github.com/kysely-org/kysely) — 85/100

- **Purpose:** Type-safe SQL query builder
- **GitHub description:** A type-safe TypeScript SQL query builder
- **Stars / forks / open issues+PRs:** 14,383 / 463 / 224 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-22 (4 days before check) · created 2021-02-22
- **Primary language / detected stack:** TypeScript / Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Postgres, SQLite, MySQL; deploy: Docker
- **Data sources & integrations:** SQLite/Postgres
- **Engineering signals:** 828 files · 140 test files · 7 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Alternative to Drizzle
- **Limitations / reasons not to reuse:** Drizzle chosen for migrations tooling
- **Decision:** **Reference**

### 9. [cloudflare/chanfana](https://github.com/cloudflare/chanfana) — 84/100

- **Purpose:** OpenAPI 3.1 generation/validation for Hono on Workers
- **GitHub description:** OpenAPI 3 and 3.1 schema generator and validator for Hono, itty-router and more!
- **Stars / forks / open issues+PRs:** 777 / 75 / 35 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-17 (9 days before check) · created 2022-11-08
- **Primary language / detected stack:** TypeScript / Hono, Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Hono, Zod
- **Engineering signals:** 129 files · 35 test files · 5 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; 35 tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Auto-generated API docs (docs/api) from route schemas
- **Limitations / reasons not to reuse:** —
- **Decision:** **Reuse (dependency)**

### 10. [cloudflare/workers-oauth-provider](https://github.com/cloudflare/workers-oauth-provider) — 82/100

- **Purpose:** OAuth 2.1 provider library for Workers (for MCP servers)
- **GitHub description:** OAuth provider library for Cloudflare Workers
- **Stars / forks / open issues+PRs:** 1,903 / 147 / 23 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2025-03-11
- **Primary language / detected stack:** TypeScript / Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** KV
- **Engineering signals:** 84 files · 19 test files · 5 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** Official; SECURITY.md
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Token encryption-at-rest approach (props encrypted with grant-derived keys)
- **Limitations / reasons not to reuse:** We are OAuth client to Google, not provider (until JobFlow MCP)
- **Decision:** **Reference**

### 11. [ottabase/ottabase](https://github.com/ottabase/ottabase) — 79/100

- **Purpose:** Full-stack SaaS monorepo for Workers (auth, RBAC, multi-tenant)
- **GitHub description:** Full-stack SaaS monorepo for Cloudflare Workers. ORM, auth, RBAC, multi-tenancy, queues, realtime, blog. Edge-native, all included, for Solo Founders
- **Stars / forks / open issues+PRs:** 46 / 6 / 32 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2025-09-13
- **Primary language / detected stack:** TypeScript / React
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** D1, R2, Queues
- **Engineering signals:** 2499 files · 505 test files · 5 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; 505 tests; SECURITY.md
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Multi-tenant SaaS structure on Workers
- **Limitations / reasons not to reuse:** Young project
- **Decision:** **Reference**

### 12. [cloudflare/workers-rs](https://github.com/cloudflare/workers-rs) — 77/100

- **Purpose:** Rust SDK for Workers
- **GitHub description:** Write Cloudflare Workers in 100% Rust via WebAssembly
- **Stars / forks / open issues+PRs:** 3,808 / 468 / 198 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-17 (9 days before check) · created 2021-08-10
- **Primary language / detected stack:** Rust / Wrangler
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** —
- **Engineering signals:** 460 files · 104 test files · 4 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Official
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** TypeScript chosen for contributor reach
- **Decision:** **Avoid**

### 13. [elliothux/open-compute](https://github.com/elliothux/open-compute) — 77/100

- **Purpose:** Self-hosted Workers-compatible platform
- **GitHub description:** Self-hosted Cloudflare Workers-compatible platform with Workers、KV、D1、R2、DO、Queues、Workflows、Cron、Cache、Images、Vectorize、AI Search、Artifacts、Static Assets、Service Bindings、Dynamic Workers、LogTail、Gateway in one Rust binary.
- **Stars / forks / open issues+PRs:** 4,320 / 344 / 7 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-22 (4 days before check) · created 2026-08-23
- **Primary language / detected stack:** Rust / React, Puppeteer
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** Postgres; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 3134 files · 1190 test files · 8 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (7/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Portability escape hatch
- **Limitations / reasons not to reuse:** Not needed
- **Decision:** **Reference**

### 14. [zpg6/better-auth-cloudflare](https://github.com/zpg6/better-auth-cloudflare) — 75/100

- **Purpose:** Integration of better-auth with Workers, D1, KV, R2
- **GitHub description:** Seamlessly integrate better-auth with Cloudflare Workers, D1, Hyperdrive, KV, R2, and geolocation services. CLI for project generation, automated resource provisioning on Cloudflare, and database migrations. Supports Next.js, Hono, and more!
- **Stars / forks / open issues+PRs:** 602 / 41 / 9 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-12 (45 days before check) · created 2025-05-07
- **Primary language / detected stack:** TypeScript / Drizzle, Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Cloudflare bindings
- **Engineering signals:** 149 files · 34 test files · 6 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; 34 tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** D1 + Drizzle wiring example
- **Limitations / reasons not to reuse:** Community project; pin versions
- **Decision:** **Reference**

### 15. [G4brym/workers-qb](https://github.com/G4brym/workers-qb) — 73/100

- **Purpose:** Zero-dependency query builder for D1/DO SQLite
- **GitHub description:** Zero dependencies Query Builder for Cloudflare Workers
- **Stars / forks / open issues+PRs:** 402 / 27 / 3 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-22 (35 days before check) · created 2022-07-30
- **Primary language / detected stack:** TypeScript / Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** D1
- **Engineering signals:** 79 files · 26 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; 26 tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Drizzle preferred
- **Decision:** **Reference**

### 16. [cloudflare/playwright](https://github.com/cloudflare/playwright) — 66/100 — **ARCHIVED**

- **Purpose:** Playwright fork running on Browser Rendering
- **GitHub description:** Playwright fork that works with Cloudflare Browser Rendering
- **Stars / forks / open issues+PRs:** 125 / 29 / 45 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-22 (65 days before check) · created 2025-03-10
- **Primary language / detected stack:** TypeScript / React, Playwright
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Browser Rendering
- **Engineering signals:** 3173 files · 1674 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Official
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Render JS-only career pages on Cloudflare (user-initiated or allowlisted)
- **Limitations / reasons not to reuse:** Billing per browser-hour; must respect robots/ToS
- **Decision:** **Reuse (optional)**

### 17. [G4brym/workers-research](https://github.com/G4brym/workers-research) — 64/100

- **Purpose:** Deep-research agent on Workers + Workflows + Browser Rendering
- **GitHub description:** A serverless, AI-powered deep research agent built with Cloudflare Workers and Google Gemini 2.5
- **Stars / forks / open issues+PRs:** 109 / 22 / 3 (checked 2026-11-26)
- **Last commit on default branch:** 2026-03-15 (256 days before check) · created 2025-02-09
- **Primary language / detected stack:** TypeScript / Hono, Puppeteer, Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Workers AI, Browser Rendering
- **Engineering signals:** 56 files · 12 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; 12 tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Workflows-based long-running pipeline example
- **Limitations / reasons not to reuse:** Stale since Mar 2026
- **Decision:** **Reference**

### 18. [mirza-rizvi/ResolveHQ](https://github.com/mirza-rizvi/ResolveHQ) — 64/100

- **Purpose:** Helpdesk on Workers with D1, R2, Queues, Email Routing
- **GitHub description:** Self-hosted helpdesk on Cloudflare Workers: D1, R2, Queues, Email Routing. Shared inbox, email threading, AI assist.
- **Stars / forks / open issues+PRs:** 215 / 16 / 12 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-29 (58 days before check) · created 2026-09-02
- **Primary language / detected stack:** TypeScript / Hono, React, Drizzle, Playwright, postal-mime, Wrangler
- **Licence:** Source-available (internal use) — commercial reuse: restricted / not permitted
- **Database / hosting signals:** Cloudflare D1; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Cloudflare stack
- **Engineering signals:** 272 files · 48 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Source-available licence (internal use only)
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Architecture reference
- **Limitations / reasons not to reuse:** Cannot reuse code commercially
- **Decision:** **Reference (licence)**

### 19. [cloudflare/actors](https://github.com/cloudflare/actors) — 63/100

- **Purpose:** Helper library for Durable Objects
- **GitHub description:** An easier way to build with Cloudflare Durable Objects
- **Stars / forks / open issues+PRs:** 453 / 28 / 32 (checked 2026-11-26)
- **Last commit on default branch:** 2025-12-03 (358 days before check) · created 2025-05-21
- **Primary language / detected stack:** TypeScript / Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** DO
- **Engineering signals:** 84 files · 4 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Alarm/scheduling helpers
- **Limitations / reasons not to reuse:** Agents SDK covers needs
- **Decision:** **Reference**

### 20. [supermemoryai/backend-api-kit](https://github.com/supermemoryai/backend-api-kit) — 55/100

- **Purpose:** Hono + Drizzle + D1 API starter
- **GitHub description:** Easily create scalable, monetisable backend APIs with Hono + Cloudflare workers. All the batteries included.
- **Stars / forks / open issues+PRs:** 558 / 47 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2025-02-01 (663 days before check) · created 2025-01-24
- **Primary language / detected stack:** TypeScript / Hono, Drizzle, Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** SQLite; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** D1
- **Engineering signals:** 33 files · 1 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; stale (Feb 2025)
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Minimal structure
- **Limitations / reasons not to reuse:** Stale
- **Decision:** **Reference**

### 21. [aidenwallis/kysely-d1](https://github.com/aidenwallis/kysely-d1) — 54/100

- **Purpose:** Kysely dialect for D1
- **GitHub description:** D1 dialect for Kysely
- **Stars / forks / open issues+PRs:** 338 / 26 / 19 (checked 2026-11-26)
- **Last commit on default branch:** 2025-04-18 (587 days before check) · created 2022-10-16
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** D1
- **Engineering signals:** 20 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; no tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Small, older
- **Decision:** **Reference**

### 22. [cloudflare/queues-web-crawler](https://github.com/cloudflare/queues-web-crawler) — 54/100 — **ARCHIVED**

- **Purpose:** Example crawler using Queues + Browser Rendering + KV
- **GitHub description:** A web crawler built with Cloudflare Queues, Browser Rendering, and Workers KV.
- **Stars / forks / open issues+PRs:** 189 / 34 / 3 (checked 2026-11-26)
- **Last commit on default branch:** 2024-09-19 (798 days before check) · created 2023-06-14
- **Primary language / detected stack:** TypeScript / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Queues, Browser Rendering
- **Engineering signals:** 15 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0; archived-era example (2024)
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Queue fan-out crawl pattern with per-domain politeness
- **Limitations / reasons not to reuse:** Example quality; no tests
- **Decision:** **Adapt**

## Appendix A — Cloudflare pricing & limits used in the cost model

Source: [`cloudflare/cloudflare-docs`](https://github.com/cloudflare/cloudflare-docs) default branch, commit dated **2026-11-26** (files read directly from the repository, because this research environment could not reach `developers.cloudflare.com`). Re-check the live pricing pages before making a budget commitment.

| Product | Workers Free | Workers Paid ($5/month minimum) | Source file |
|---|---|---|---|
| Workers requests | 100,000/day | 10M/month included, then $0.30/M | `workers/platform/pricing.mdx` |
| Workers CPU | 10 ms per invocation | 30M CPU-ms/month included, then $0.02/M CPU-ms. Up to 5 min CPU per invocation (default 30 s), 15 min per Cron invocation for intervals of 1 h or more | same |
| Static asset requests | Free | Free (not billed) | same |
| Subrequests | 50 per invocation | 10,000 per invocation (default) | `workers/platform/limits.mdx` |
| Cron Triggers | 5 per account | 1,000 per account | same |
| D1 rows read | 5M/day | 25B/month included, then $0.001/M | `partials/workers/d1-pricing.mdx` |
| D1 rows written | 100,000/day | 50M/month included, then $1.00/M | same |
| D1 storage | 5 GB total | 5 GB included, then $0.75/GB-month | same |
| D1 max database size | 500 MB | **10 GB per database** (1 TB per account) | `d1/platform/limits.mdx` |
| R2 storage (Standard) | 10 GB-month | $0.015/GB-month | `r2/pricing.mdx` |
| R2 Class A / Class B ops | 1M / 10M per month | $4.50/M / $0.36/M | same |
| R2 egress | Free | Free | same |
| Queues | 10,000 ops/day, 24 h retention | 1M ops/month included, then $0.40/M. Retention 4 days by default (max 14). About 3 ops per delivered message | `partials/workers/queues_pricing.mdx` |
| Durable Objects requests | 100,000/day | 1M/month included, then $0.15/M (alarms count as requests) | `partials/durable-objects/durable-objects-pricing.mdx` |
| Durable Objects duration | 13,000 GB-s/day | 400,000 GB-s/month included, then $12.50/M GB-s. Hibernation-eligible objects are not billed for duration | same |
| DO SQLite storage | 5 GB | 5 GB-month included, then $0.20/GB-month. Rows billed like D1 | same |
| Workers AI | 10,000 neurons/day | 10,000 neurons/day free, then $0.011 per 1,000 neurons | `workers-ai/platform/pricing.mdx` |
| Workers AI models (examples) | — | `llama-3.1-8b-instruct-fp8-fast` $0.045/M input + $0.384/M output tokens. `qwen3-30b-a3b-fp8` $0.051/$0.335. `bge-m3` embeddings $0.012/M tokens | same |
| Browser Rendering (Browser Run) | 10 min/day, 3 concurrent | 10 h/month, then $0.09 per browser-hour. 10 concurrent browsers (monthly average), then $2.00 per extra browser | `browser-run/pricing.mdx` |
