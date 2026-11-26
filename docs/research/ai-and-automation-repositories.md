# AI, Browser Automation, Parsing, Search & Analytics Repository Research

> Metrics checked on **2026-11-26** via the GitHub REST search API and shallow, blob-less git clones of each repository. Stars/forks/issues change daily; re-run `scripts/research/` (see methodology) to refresh.

Supporting projects for LLM orchestration, structured extraction, resume/document parsing, browser automation (user-authorised only), crawling, search and product analytics.


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
| 1 | [colinhacks/zod](https://github.com/colinhacks/zod) | **93** | 15 | 14 | 15 | 15 | 9 | 10 | 10 | 5 | Reuse (dependency) |
| 2 | [vercel/ai](https://github.com/vercel/ai) | **93** | 16 | 14 | 15 | 15 | 9 | 10 | 9 | 5 | Reuse (dependency) |
| 3 | [cloudflare/agents](https://github.com/cloudflare/agents) | **89** | 15 | 13 | 15 | 15 | 8 | 9 | 10 | 4 | Reuse (dependency) |
| 4 | [microsoft/playwright](https://github.com/microsoft/playwright) | **87** | 14 | 15 | 15 | 15 | 9 | 9 | 5 | 5 | Reuse (testing) |
| 5 | [cheeriojs/cheerio](https://github.com/cheeriojs/cheerio) | **85** | 12 | 13 | 15 | 15 | 9 | 8 | 8 | 5 | Reuse (dependency) |
| 6 | [mozilla/pdf.js](https://github.com/mozilla/pdf.js) | **85** | 12 | 15 | 15 | 15 | 9 | 9 | 5 | 5 | Reference |
| 7 | [unjs/unpdf](https://github.com/unjs/unpdf) | **85** | 17 | 11 | 15 | 15 | 8 | 6 | 10 | 3 | Reuse (dependency) |
| 8 | [huggingface/transformers.js](https://github.com/huggingface/transformers.js) | **79** | 10 | 13 | 15 | 15 | 9 | 8 | 5 | 4 | Reference |
| 9 | [mozilla/readability](https://github.com/mozilla/readability) | **79** | 13 | 12 | 9 | 15 | 9 | 8 | 9 | 4 | Reuse (dependency) |
| 10 | [langchain-ai/langgraphjs](https://github.com/langchain-ai/langgraphjs) | **78** | 10 | 12 | 15 | 15 | 8 | 9 | 6 | 3 | Reference |
| 11 | [triggerdotdev/trigger.dev](https://github.com/triggerdotdev/trigger.dev) | **78** | 10 | 13 | 15 | 15 | 8 | 10 | 3 | 4 | Reference |
| 12 | [apify/crawlee](https://github.com/apify/crawlee) | **77** | 10 | 14 | 15 | 15 | 6 | 10 | 2 | 5 | Reference |
| 13 | [umami-software/umami](https://github.com/umami-software/umami) | **76** | 9 | 12 | 15 | 15 | 9 | 8 | 3 | 5 | Reference |
| 14 | [microsoft/markitdown](https://github.com/microsoft/markitdown) | **75** | 11 | 11 | 15 | 15 | 9 | 8 | 1 | 5 | Reference |
| 15 | [Unstructured-IO/unstructured](https://github.com/Unstructured-IO/unstructured) | **75** | 11 | 12 | 15 | 15 | 8 | 9 | 1 | 4 | Reference |
| 16 | [browser-use/browser-use](https://github.com/browser-use/browser-use) | **74** | 12 | 11 | 15 | 15 | 6 | 8 | 2 | 5 | Reference |
| 17 | [nanobrowser/nanobrowser](https://github.com/nanobrowser/nanobrowser) | **73** | 11 | 10 | 15 | 15 | 7 | 9 | 2 | 4 | Reference |
| 18 | [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) | **73** | 8 | 12 | 15 | 15 | 8 | 9 | 1 | 5 | Reference |
| 19 | [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | **71** | 8 | 12 | 15 | 15 | 8 | 7 | 1 | 5 | Avoid |
| 20 | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | **70** | 9 | 10 | 15 | 15 | 6 | 8 | 2 | 5 | Reference |
| 21 | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) | **69** | 11 | 12 | 15 | 2 | 8 | 10 | 6 | 5 | Reference |
| 22 | [PostHog/posthog](https://github.com/PostHog/posthog) | **66** | 10 | 13 | 15 | 2 | 8 | 10 | 3 | 5 | Reference |
| 23 | [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | **65** | 10 | 12 | 15 | 4 | 6 | 9 | 4 | 5 | Reference (AGPL) |
| 24 | [plausible/analytics](https://github.com/plausible/analytics) | **65** | 8 | 13 | 15 | 4 | 9 | 10 | 1 | 5 | Avoid |
| 25 | [typesense/typesense](https://github.com/typesense/typesense) | **65** | 8 | 13 | 15 | 6 | 8 | 9 | 1 | 5 | Reference |
| 26 | [meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) | **63** | 9 | 14 | 15 | 2 | 8 | 9 | 1 | 5 | Reference |
| 27 | [567-labs/instructor-js](https://github.com/567-labs/instructor-js) | **62** | 9 | 9 | 3 | 15 | 8 | 8 | 8 | 2 | Avoid |
| 28 | [activepieces/activepieces](https://github.com/activepieces/activepieces) | **62** | 9 | 12 | 15 | 2 | 8 | 10 | 1 | 5 | Reference |
| 29 | [magnitudedev/browser-agent](https://github.com/magnitudedev/browser-agent) | **58** | 9 | 9 | 6 | 15 | 6 | 8 | 2 | 3 | Reference |

**Total repositories evaluated in this report: 29.**


## Repository details

### 1. [colinhacks/zod](https://github.com/colinhacks/zod) — 93/100

- **Purpose:** TypeScript schema validation
- **GitHub description:** TypeScript-first schema validation with static type inference
- **Stars / forks / open issues+PRs:** 44,428 / 2,377 / 132 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-22 (4 days before check) · created 2020-03-07
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 747 files · 205 test files · 8 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** API validation, LLM structured outputs, env validation
- **Limitations / reasons not to reuse:** —
- **Decision:** **Reuse (dependency)**

### 2. [vercel/ai](https://github.com/vercel/ai) — 93/100

- **Purpose:** AI SDK: provider-agnostic text/structured generation, tool calls
- **GitHub description:** The AI Toolkit for TypeScript. From the creators of Next.js, the AI SDK is a free open-source library for building AI-powered applications and agents 
- **Stars / forks / open issues+PRs:** 28,230 / 5,722 / 1,719 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2023-05-23
- **Primary language / detected stack:** TypeScript / Next.js, React, Playwright
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** OpenAI, Anthropic, Google, Workers AI (via workers-ai-provider)
- **Engineering signals:** 10274 files · 1536 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0; 1.5k tests
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** generateObject with Zod schemas for matching, resume extraction, email drafting
- **Limitations / reasons not to reuse:** Large surface; import only core + providers
- **Decision:** **Reuse (dependency)**

### 3. [cloudflare/agents](https://github.com/cloudflare/agents) — 89/100

- **Purpose:** Cloudflare Agents SDK: stateful agents on Durable Objects, scheduling, MCP
- **GitHub description:** Build and deploy AI Agents on Cloudflare 
- **Stars / forks / open issues+PRs:** 6,149 / 872 / 209 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2025-01-29
- **Primary language / detected stack:** TypeScript / React, Playwright, OpenAI SDK, Anthropic SDK, Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Durable Objects, Workers AI
- **Engineering signals:** 3396 files · 890 test files · 12 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Official; 890 tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Per-user agent DO with built-in scheduling (follow-up timers), MCP server support
- **Limitations / reasons not to reuse:** Fast-moving API; pin versions
- **Decision:** **Reuse (dependency)**

### 4. [microsoft/playwright](https://github.com/microsoft/playwright) — 87/100

- **Purpose:** Browser automation & E2E testing
- **GitHub description:** Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API. 
- **Stars / forks / open issues+PRs:** 101,096 / 6,983 / 48 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2019-11-15
- **Primary language / detected stack:** TypeScript / Next.js, React, Playwright
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Chromium/Firefox/WebKit
- **Engineering signals:** 3158 files · 1550 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0; industry standard
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** E2E tests for JobFlow UI
- **Limitations / reasons not to reuse:** Use for tests; production browser work via Browser Rendering only
- **Decision:** **Reuse (testing)**

### 5. [cheeriojs/cheerio](https://github.com/cheeriojs/cheerio) — 85/100

- **Purpose:** Fast HTML parsing/selection
- **GitHub description:** The fast, flexible, and elegant library for parsing and manipulating HTML and XML.
- **Stars / forks / open issues+PRs:** 30,555 / 1,757 / 81 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2011-10-09
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 126 files · 14 test files · 9 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Parse career-page HTML for JobPosting JSON-LD and ATS links
- **Limitations / reasons not to reuse:** Needs nodejs_compat for some builds; HTMLRewriter is native alternative
- **Decision:** **Reuse (dependency)**

### 6. [mozilla/pdf.js](https://github.com/mozilla/pdf.js) — 85/100

- **Purpose:** Reference PDF renderer/parser
- **GitHub description:** PDF Reader in JavaScript
- **Stars / forks / open issues+PRs:** 54,194 / 10,749 / 466 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2011-04-26
- **Primary language / detected stack:** JavaScript / Puppeteer, PDF libs
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 2758 files · 1765 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Underlying engine of unpdf
- **Limitations / reasons not to reuse:** Use via unpdf in Workers
- **Decision:** **Reference**

### 7. [unjs/unpdf](https://github.com/unjs/unpdf) — 85/100

- **Purpose:** Serverless-friendly PDF.js build for text extraction (Workers-compatible)
- **GitHub description:** 📄 PDF extraction and rendering across all JavaScript runtimes
- **Stars / forks / open issues+PRs:** 1,279 / 50 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-23 (3 days before check) · created 2023-08-11
- **Primary language / detected stack:** TypeScript / PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** pdf.js
- **Engineering signals:** 74 files · 29 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; wrangler tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Resume PDF text extraction inside Workers
- **Limitations / reasons not to reuse:** Text-only; scanned PDFs need OCR
- **Decision:** **Reuse (dependency)**

### 8. [huggingface/transformers.js](https://github.com/huggingface/transformers.js) — 79/100

- **Purpose:** Run transformer models in JS
- **GitHub description:** State-of-the-art Machine Learning for the web. Run 🤗 Transformers directly in your browser, with no need for a server!
- **Stars / forks / open issues+PRs:** 16,458 / 1,249 / 302 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-22 (4 days before check) · created 2023-02-13
- **Primary language / detected stack:** JavaScript / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** ONNX
- **Engineering signals:** 763 files · 201 test files · 5 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Workers AI embeddings are simpler on CF
- **Decision:** **Reference**

### 9. [mozilla/readability](https://github.com/mozilla/readability) — 79/100

- **Purpose:** Extract main content from HTML pages
- **GitHub description:** A standalone version of the readability lib
- **Stars / forks / open issues+PRs:** 11,564 / 743 / 323 (checked 2026-11-26)
- **Last commit on default branch:** 2026-07-09 (140 days before check) · created 2015-02-03
- **Primary language / detected stack:** JavaScript / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 418 files · 396 test files · 0 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0; 396 tests
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** Clean job-description extraction from career pages (with linkedom)
- **Limitations / reasons not to reuse:** Needs DOM implementation (linkedom) in Workers
- **Decision:** **Reuse (dependency)**

### 10. [langchain-ai/langgraphjs](https://github.com/langchain-ai/langgraphjs) — 78/100

- **Purpose:** Graph-based agent orchestration (TS)
- **GitHub description:** Framework to build resilient language agents as graphs.
- **Stars / forks / open issues+PRs:** 3,428 / 648 / 252 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2024-01-09
- **Primary language / detected stack:** TypeScript / Hono, LangChain
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** SQLite; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** LangChain
- **Engineering signals:** 2055 files · 659 test files · 7 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (6/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Heavier than needed
- **Decision:** **Reference**

### 11. [triggerdotdev/trigger.dev](https://github.com/triggerdotdev/trigger.dev) — 78/100

- **Purpose:** Background jobs & durable workflows platform
- **GitHub description:** Trigger.dev – build and deploy durable AI agents and workflows
- **Stars / forks / open issues+PRs:** 16,825 / 1,546 / 268 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2022-11-30
- **Primary language / detected stack:** TypeScript / Hono, React, Prisma, Playwright, Anthropic SDK
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** SQLite; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Own runtime
- **Engineering signals:** 8585 files · 2316 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Retry/backoff & idempotency patterns
- **Limitations / reasons not to reuse:** Cloudflare Queues + DO cover our needs
- **Decision:** **Reference**

### 12. [apify/crawlee](https://github.com/apify/crawlee) — 77/100

- **Purpose:** Node crawling/scraping framework
- **GitHub description:** Crawlee—A web scraping and browser automation library for Node.js to build reliable crawlers. In JavaScript and TypeScript. Extract data for AI, LLMs, RAG, or GPTs. Download HTML, PDF, JPG, PNG, and other files from websites. Works with Puppeteer, Playwright, Cheerio, JSDOM, and raw HTTP. Both headful and headless mode. With proxy rotation.
- **Stars / forks / open issues+PRs:** 26,591 / 1,784 / 129 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2016-08-26
- **Primary language / detected stack:** TypeScript / Next.js, Playwright, Puppeteer
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Playwright/Puppeteer, includes stealth/fingerprint tooling
- **Engineering signals:** 3037 files · 450 test files · 11 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0; ships anti-detection features JobFlow must not use
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Polite-crawling (robots, concurrency, retries) concepts
- **Limitations / reasons not to reuse:** Node runtime; evasion features
- **Decision:** **Reference**

### 13. [umami-software/umami](https://github.com/umami-software/umami) — 76/100

- **Purpose:** Privacy-friendly web analytics
- **GitHub description:** Umami is a privacy-first web and product analytics platform. Traffic, campaigns, behavior, conversions, and revenue in one place. No cookies, no surveillance, self-hosted or in the cloud.
- **Stars / forks / open issues+PRs:** 40,370 / 8,657 / 140 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-23 (3 days before check) · created 2020-07-17
- **Primary language / detected stack:** TypeScript / Next.js, React, Prisma, Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Redis; deploy: Docker
- **Data sources & integrations:** Postgres/MySQL
- **Engineering signals:** 2164 files · 253 test files · 5 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Cookieless landing-page analytics model
- **Limitations / reasons not to reuse:** Needs DB outside CF; Cloudflare Web Analytics is free alternative
- **Decision:** **Reference**

### 14. [microsoft/markitdown](https://github.com/microsoft/markitdown) — 75/100

- **Purpose:** Convert PDF/DOCX/etc. to Markdown (Python)
- **GitHub description:** Python tool for converting files and office documents to Markdown.
- **Stars / forks / open issues+PRs:** 198,539 / 15,075 / 825 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-06 (20 days before check) · created 2024-11-13
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 198 files · 112 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: no · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** DOCX handling approach
- **Limitations / reasons not to reuse:** Python
- **Decision:** **Reference**

### 15. [Unstructured-IO/unstructured](https://github.com/Unstructured-IO/unstructured) — 75/100

- **Purpose:** Document parsing/ETL for LLMs (Python)
- **GitHub description:** Convert documents to structured data effortlessly. Unstructured is open-source ETL solution for transforming complex documents into clean, structured formats for language models.  Visit our website to learn more about our enterprise grade Platform product for production grade workflows, partitioning, enrichments, chunking and embedding.
- **Stars / forks / open issues+PRs:** 15,793 / 1,410 / 493 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2022-09-26
- **Primary language / detected stack:** HTML / OpenAI SDK, PDF libs
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** Postgres, MongoDB; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 1363 files · 123 test files · 9 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Python; heavy
- **Decision:** **Reference**

### 16. [browser-use/browser-use](https://github.com/browser-use/browser-use) — 74/100

- **Purpose:** Python framework letting LLMs drive a browser
- **GitHub description:** Open-source Python library for AI browser agents, plus Browser Use Cloud: stealth browsers and a hosted agent API.
- **Stars / forks / open issues+PRs:** 122,116 / 13,657 / 589 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2024-10-31
- **Primary language / detected stack:** Python / OpenAI SDK, Anthropic SDK
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Playwright/CDP; LLM providers
- **Engineering signals:** 147 files · 25 test files · 8 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Powerful automation; must be user-supervised
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Agent-browser loop concepts
- **Limitations / reasons not to reuse:** Python; not for automated third-party submissions
- **Decision:** **Reference**

### 17. [nanobrowser/nanobrowser](https://github.com/nanobrowser/nanobrowser) — 73/100

- **Purpose:** Browser-extension AI agent using the user's own logged-in browser
- **GitHub description:** Open-source AI agent for web automation. Use your real, logged-in browser to automate daily tasks.
- **Stars / forks / open issues+PRs:** 14,396 / 1,546 / 64 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-23 (3 days before check) · created 2024-12-31
- **Primary language / detected stack:** TypeScript / React, Puppeteer, OpenAI SDK, Anthropic SDK
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** User's browser; LLMs
- **Engineering signals:** 494 files · 84 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Runs locally in user's browser — consent model fits "user-authorised" workflows
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Extension architecture for user-approved form assist (future)
- **Limitations / reasons not to reuse:** Extension, not server
- **Decision:** **Reference**

### 18. [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) — 73/100

- **Purpose:** Programming (not prompting) LMs; prompt optimisation
- **GitHub description:** DSPy: The framework for programming—not prompting—language models
- **Stars / forks / open issues+PRs:** 39,240 / 3,556 / 851 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2023-01-09
- **Primary language / detected stack:** Python / LangChain, OpenAI SDK, Anthropic SDK
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 756 files · 187 test files · 7 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Evaluation-driven prompt iteration
- **Limitations / reasons not to reuse:** Python
- **Decision:** **Reference**

### 19. [langchain-ai/langchain](https://github.com/langchain-ai/langchain) — 71/100

- **Purpose:** Python LLM application framework
- **GitHub description:** The agent engineering platform.
- **Stars / forks / open issues+PRs:** 150,019 / 25,173 / 779 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2022-10-17
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Many
- **Engineering signals:** 3309 files · 1121 test files · 12 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Python; abstraction overhead
- **Decision:** **Avoid**

### 20. [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) — 70/100

- **Purpose:** Browser automation CLI for AI agents (Rust)
- **GitHub description:** Browser automation CLI for AI agents
- **Stars / forks / open issues+PRs:** 54,065 / 3,774 / 505 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2026-01-11
- **Primary language / detected stack:** Rust / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** CDP
- **Engineering signals:** 730 files · 42 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** CLI tool
- **Decision:** **Reference**

### 21. [mastra-ai/mastra](https://github.com/mastra-ai/mastra) — 69/100

- **Purpose:** TypeScript agent/workflow framework
- **GitHub description:** Mastra is the modern TypeScript framework for AI-powered applications and agents.
- **Stars / forks / open issues+PRs:** 29,829 / 3,140 / 919 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2024-08-06
- **Primary language / detected stack:** TypeScript / Hono, React
- **Licence:** Apache-2.0 + ee/ commercial — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Many LLMs; Hono
- **Engineering signals:** 26046 files · 7735 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0 + ee/ portions
- **Cloudflare Workers compatibility (6/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Workflow DSL ideas
- **Limitations / reasons not to reuse:** Extra abstraction not needed for v1
- **Decision:** **Reference**

### 22. [PostHog/posthog](https://github.com/PostHog/posthog) — 66/100

- **Purpose:** Product analytics, feature flags, session replay
- **GitHub description:** :hedgehog: PostHog is the leading platform for building self-driving products. Our developer tools – AI observability, analytics, session replay, flags, experiments, error tracking, logs, and more – capture all the context agents need to diagnose problems, uncover opportunities, and ship fixes. Steer it all from Slack, web, desktop, or the MCP.
- **Stars / forks / open issues+PRs:** 41,140 / 3,732 / 4,483 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2020-01-23
- **Primary language / detected stack:** Python / Django, Playwright, LangChain, OpenAI SDK, Anthropic SDK, PDF libs
- **Licence:** MIT + ee/ commercial — commercial reuse: restricted / not permitted
- **Database / hosting signals:** Postgres, Redis; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Self-host/cloud
- **Engineering signals:** 75721 files · 19202 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT + ee/
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Activation/retention event taxonomy
- **Limitations / reasons not to reuse:** External infra; v1 uses first-party D1 events (+ optional Workers Analytics Engine)
- **Decision:** **Reference**

### 23. [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) — 65/100

- **Purpose:** Web-to-LLM-ready crawling API
- **GitHub description:** Knowledge infrastructure to make your agents smarter. Search, scrape and access 550+ data providers through one API.
- **Stars / forks / open issues+PRs:** 210,489 / 11,021 / 926 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2024-04-15
- **Primary language / detected stack:** TypeScript / —
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Self-host or cloud
- **Engineering signals:** 1494 files · 384 test files · 12 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** AGPL-3.0
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Career-page extraction ideas
- **Limitations / reasons not to reuse:** AGPL; external service
- **Decision:** **Reference (AGPL)**

### 24. [plausible/analytics](https://github.com/plausible/analytics) — 65/100

- **Purpose:** Privacy-friendly web analytics (Elixir)
- **GitHub description:** Open source, privacy-first web analytics. Lightweight, cookie-free Google Analytics alternative. Self-hosted or cloud.
- **Stars / forks / open issues+PRs:** 29,942 / 1,946 / 51 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2018-12-04
- **Primary language / detected stack:** Elixir / —
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** ClickHouse
- **Engineering signals:** 2170 files · 595 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** AGPL-3.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** AGPL; infra outside CF
- **Decision:** **Avoid**

### 25. [typesense/typesense](https://github.com/typesense/typesense) — 65/100

- **Purpose:** Typo-tolerant search engine
- **GitHub description:** Open Source alternative to Algolia + Pinecone and an Easier-to-Use alternative to ElasticSearch ⚡ 🔍 ✨ Fast, typo tolerant, in-memory fuzzy Search Engine for building delightful search experiences
- **Stars / forks / open issues+PRs:** 27,175 / 1,036 / 945 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-23 (3 days before check) · created 2017-01-18
- **Primary language / detected stack:** C++ / —
- **Licence:** GPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 512 files · 149 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** GPL-3.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Server infra
- **Decision:** **Reference**

### 26. [meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) — 63/100

- **Purpose:** Search engine (Rust)
- **GitHub description:** A lightning-fast search engine API bringing AI-powered hybrid search to your sites and applications.
- **Stars / forks / open issues+PRs:** 60,016 / 2,802 / 320 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2018-04-23
- **Primary language / detected stack:** Rust / —
- **Licence:** MIT + BSL EE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 1756 files · 564 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT + BSL EE
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Ranking-rules design
- **Limitations / reasons not to reuse:** Server infra; D1 FTS5 suffices for v1
- **Decision:** **Reference**

### 27. [567-labs/instructor-js](https://github.com/567-labs/instructor-js) — 62/100

- **Purpose:** Structured LLM outputs for TS
- **GitHub description:** structured extraction for llms
- **Stars / forks / open issues+PRs:** 805 / 72 / 14 (checked 2026-11-26)
- **Last commit on default branch:** 2025-01-27 (668 days before check) · created 2024-01-01
- **Primary language / detected stack:** TypeScript / OpenAI SDK, Anthropic SDK
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** OpenAI
- **Engineering signals:** 104 files · 13 test files · 5 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; stale since Jan 2025
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Superseded by AI SDK generateObject
- **Decision:** **Avoid**

### 28. [activepieces/activepieces](https://github.com/activepieces/activepieces) — 62/100

- **Purpose:** Open-source automation platform (Zapier alternative)
- **GitHub description:** AI Agents & MCPs & AI Workflow Automation • (~400 MCP servers for AI agents) • AI Automation / AI Agent with MCPs • AI Workflows & AI Agents • MCPs for AI Agents
- **Stars / forks / open issues+PRs:** 25,741 / 4,516 / 1,027 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2022-12-03
- **Primary language / detected stack:** TypeScript / React, Playwright
- **Licence:** MIT + ee/ commercial — commercial reuse: restricted / not permitted
- **Database / hosting signals:** SQLite, Redis; deploy: Docker
- **Data sources & integrations:** 200+ pieces
- **Engineering signals:** 37190 files · 2198 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT + ee/
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Webhook integration patterns
- **Limitations / reasons not to reuse:** Heavy server
- **Decision:** **Reference**

### 29. [magnitudedev/browser-agent](https://github.com/magnitudedev/browser-agent) — 58/100

- **Purpose:** Vision-first browser agent
- **GitHub description:** Open-source, vision-first browser agent
- **Stars / forks / open issues+PRs:** 4,147 / 249 / 32 (checked 2026-11-26)
- **Last commit on default branch:** 2026-02-08 (291 days before check) · created 2025-03-20
- **Primary language / detected stack:** TypeScript / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Playwright
- **Engineering signals:** 220 files · 16 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0; stale since Feb 2026
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Stale
- **Decision:** **Reference**
