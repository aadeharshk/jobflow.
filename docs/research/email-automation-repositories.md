# Email, Gmail & Communication Repository Research

> Metrics checked on **2026-11-26** via the GitHub REST search API and shallow, blob-less git clones of each repository. Stars/forks/issues change daily; re-run `scripts/research/` (see methodology) to refresh.

Scope: Gmail API, Google OAuth 2.0, sending, scheduling/queues, reply detection, threads, parsing/classification, IMAP/SMTP, attachments, templates, AI email agents, follow-ups, deliverability/bounces, tracking, campaigns (evaluated as anti-patterns for 1:1 applications), inbox management and Cloudflare email.


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
| 1 | [panva/oauth4webapi](https://github.com/panva/oauth4webapi) | **88** | 14 | 13 | 15 | 15 | 10 | 9 | 10 | 2 | Reuse (alternative) |
| 2 | [postalsys/postal-mime](https://github.com/postalsys/postal-mime) | **87** | 17 | 12 | 15 | 15 | 9 | 7 | 10 | 2 | Reuse (dependency) |
| 3 | [googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client) | **85** | 16 | 13 | 15 | 15 | 9 | 10 | 3 | 4 | Reference |
| 4 | [crisp-oss/email-reply-parser](https://github.com/crisp-oss/email-reply-parser) | **84** | 16 | 11 | 15 | 15 | 8 | 8 | 10 | 1 | Reuse (dependency) |
| 5 | [resend/react-email](https://github.com/resend/react-email) | **84** | 11 | 12 | 15 | 15 | 8 | 10 | 8 | 5 | Reuse (system emails) |
| 6 | [choyiny/saasmail](https://github.com/choyiny/saasmail) | **83** | 12 | 11 | 15 | 15 | 8 | 10 | 10 | 2 | Adapt |
| 7 | [dahlia/upyo](https://github.com/dahlia/upyo) | **82** | 12 | 11 | 15 | 15 | 8 | 10 | 9 | 2 | Reference |
| 8 | [nodemailer/nodemailer](https://github.com/nodemailer/nodemailer) | **81** | 14 | 13 | 15 | 15 | 9 | 9 | 2 | 4 | Reference |
| 9 | [pilcrowonpaper/arctic](https://github.com/pilcrowonpaper/arctic) | **79** | 15 | 10 | 15 | 15 | 9 | 2 | 10 | 3 | Reuse (dependency) |
| 10 | [postalsys/imapflow](https://github.com/postalsys/imapflow) | **78** | 11 | 13 | 15 | 15 | 8 | 10 | 4 | 2 | Reference |
| 11 | [axllent/mailpit](https://github.com/axllent/mailpit) | **77** | 9 | 12 | 15 | 15 | 9 | 10 | 3 | 4 | Reuse (dev only) |
| 12 | [nodemailer/mailparser](https://github.com/nodemailer/mailparser) | **77** | 13 | 12 | 15 | 15 | 8 | 8 | 3 | 3 | Reference |
| 13 | [zou-yu/worker-mailer](https://github.com/zou-yu/worker-mailer) | **77** | 11 | 10 | 15 | 15 | 8 | 6 | 10 | 2 | Reference |
| 14 | [resend/resend-node](https://github.com/resend/resend-node) | **76** | 8 | 10 | 15 | 15 | 8 | 9 | 9 | 2 | Reuse (system emails, optional) |
| 15 | [mibgb65-cloud/OmniMail](https://github.com/mibgb65-cloud/OmniMail) | **75** | 11 | 9 | 12 | 15 | 7 | 9 | 10 | 2 | Reference |
| 16 | [elie222/inbox-zero](https://github.com/elie222/inbox-zero) | **74** | 17 | 13 | 15 | 4 | 8 | 10 | 3 | 4 | Reference (AGPL) |
| 17 | [postalserver/postal](https://github.com/postalserver/postal) | **73** | 9 | 11 | 15 | 15 | 8 | 10 | 1 | 4 | Avoid |
| 18 | [postalsys/mailauth](https://github.com/postalsys/mailauth) | **73** | 8 | 12 | 15 | 15 | 8 | 9 | 5 | 1 | Reference |
| 19 | [github/email_reply_parser](https://github.com/github/email_reply_parser) | **72** | 14 | 9 | 12 | 15 | 8 | 6 | 6 | 2 | Adapt |
| 20 | [pimalaya/himalaya](https://github.com/pimalaya/himalaya) | **71** | 7 | 11 | 15 | 15 | 8 | 10 | 1 | 4 | Reference |
| 21 | [haraka/Haraka](https://github.com/haraka/Haraka) | **70** | 6 | 11 | 15 | 15 | 8 | 10 | 1 | 4 | Avoid |
| 22 | [mailgun/talon](https://github.com/mailgun/talon) | **69** | 14 | 8 | 12 | 15 | 7 | 7 | 3 | 3 | Reference |
| 23 | [mjmlio/mjml](https://github.com/mjmlio/mjml) | **69** | 8 | 10 | 12 | 15 | 8 | 7 | 5 | 4 | Reference |
| 24 | [nikolausm/imap-mcp-server](https://github.com/nikolausm/imap-mcp-server) | **69** | 9 | 10 | 15 | 15 | 8 | 8 | 3 | 1 | Reference |
| 25 | [skyphusion-labs/postern](https://github.com/skyphusion-labs/postern) | **69** | 11 | 11 | 15 | 4 | 8 | 10 | 10 | 0 | Reference (AGPL) |
| 26 | [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox) | **68** | 15 | 10 | 6 | 15 | 8 | 0 | 10 | 4 | Adapt |
| 27 | [maildev/maildev](https://github.com/maildev/maildev) | **68** | 8 | 9 | 12 | 15 | 8 | 9 | 3 | 4 | Reuse (dev only) |
| 28 | [warmbly/warmbly](https://github.com/warmbly/warmbly) | **68** | 9 | 10 | 15 | 15 | 4 | 9 | 3 | 3 | Avoid |
| 29 | [eleith/emailjs](https://github.com/eleith/emailjs) | **67** | 9 | 9 | 15 | 15 | 7 | 7 | 2 | 3 | Reference |
| 30 | [googleapis/google-auth-library-nodejs](https://github.com/googleapis/google-auth-library-nodejs) | **66** | 13 | 13 | 0 | 15 | 9 | 10 | 3 | 3 | Reference |
| 31 | [jhillyerd/enmime](https://github.com/jhillyerd/enmime) | **66** | 7 | 11 | 15 | 15 | 8 | 7 | 1 | 2 | Reference |
| 32 | [jstedfast/MimeKit](https://github.com/jstedfast/MimeKit) | **66** | 7 | 13 | 15 | 15 | 9 | 3 | 1 | 3 | Reference |
| 33 | [reacherhq/check-if-email-exists](https://github.com/reacherhq/check-if-email-exists) | **66** | 10 | 9 | 15 | 15 | 5 | 6 | 2 | 4 | Avoid |
| 34 | [codefuturist/email-mcp](https://github.com/codefuturist/email-mcp) | **65** | 10 | 11 | 12 | 10 | 8 | 10 | 3 | 1 | Reference (LGPL) |
| 35 | [forwardemail/email-templates](https://github.com/forwardemail/email-templates) | **65** | 12 | 9 | 9 | 15 | 7 | 6 | 4 | 3 | Reference |
| 36 | [KartikTalwar/gmail.js](https://github.com/KartikTalwar/gmail.js) | **65** | 7 | 8 | 15 | 15 | 6 | 8 | 3 | 3 | Avoid |
| 37 | [n8n-io/n8n](https://github.com/n8n-io/n8n) | **65** | 11 | 13 | 15 | 2 | 8 | 10 | 1 | 5 | Reference |
| 38 | [postalsys/emailengine](https://github.com/postalsys/emailengine) | **65** | 13 | 12 | 15 | 2 | 8 | 10 | 2 | 3 | Avoid (licence) |
| 39 | [akazwz/smail](https://github.com/akazwz/smail) | **63** | 7 | 7 | 15 | 15 | 6 | 2 | 9 | 2 | Reference |
| 40 | [dittofeed/dittofeed](https://github.com/dittofeed/dittofeed) | **63** | 7 | 10 | 12 | 15 | 7 | 7 | 2 | 3 | Avoid |
| 41 | [Foundry376/Mailspring](https://github.com/Foundry376/Mailspring) | **63** | 8 | 11 | 15 | 6 | 8 | 10 | 1 | 4 | Reference (GPL) |
| 42 | [knadh/listmonk](https://github.com/knadh/listmonk) | **61** | 8 | 12 | 15 | 4 | 8 | 8 | 1 | 5 | Avoid |
| 43 | [oiov/vmail](https://github.com/oiov/vmail) | **61** | 8 | 7 | 15 | 6 | 6 | 6 | 10 | 3 | Reference (GPL) |
| 44 | [stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart) | **61** | 6 | 13 | 15 | 4 | 9 | 9 | 1 | 4 | Avoid |
| 45 | [eracle/OpenOutreach](https://github.com/eracle/OpenOutreach) | **60** | 10 | 7 | 15 | 15 | 4 | 5 | 1 | 3 | Avoid |
| 46 | [mettle/sendportal](https://github.com/mettle/sendportal) | **60** | 7 | 8 | 12 | 15 | 7 | 7 | 1 | 3 | Avoid |
| 47 | [ikvk/imap_tools](https://github.com/ikvk/imap_tools) | **59** | 7 | 9 | 12 | 15 | 7 | 6 | 1 | 2 | Reference |
| 48 | [GAM-team/got-your-back](https://github.com/GAM-team/got-your-back) | **58** | 9 | 8 | 12 | 15 | 8 | 2 | 1 | 3 | Reference |
| 49 | [s1t5/mail-archiver](https://github.com/s1t5/mail-archiver) | **58** | 7 | 9 | 15 | 6 | 8 | 9 | 1 | 3 | Reference (GPL) |
| 50 | [sendgrid/sendgrid-nodejs](https://github.com/sendgrid/sendgrid-nodejs) | **58** | 7 | 9 | 3 | 15 | 8 | 8 | 5 | 3 | Avoid |
| 51 | [simonrob/email-oauth2-proxy](https://github.com/simonrob/email-oauth2-proxy) | **58** | 8 | 7 | 15 | 15 | 8 | 1 | 1 | 3 | Reference |
| 52 | [forwardemail/forwardemail.net](https://github.com/forwardemail/forwardemail.net) | **57** | 9 | 11 | 15 | 2 | 8 | 8 | 1 | 3 | Avoid (licence) |
| 53 | [mailgun/flanker](https://github.com/mailgun/flanker) | **56** | 9 | 8 | 6 | 15 | 7 | 7 | 1 | 3 | Reference |
| 54 | [Notifuse/notifuse](https://github.com/Notifuse/notifuse) | **56** | 7 | 11 | 15 | 2 | 8 | 9 | 1 | 3 | Avoid (licence) |
| 55 | [jeremyephron/simplegmail](https://github.com/jeremyephron/simplegmail) | **55** | 10 | 7 | 9 | 15 | 7 | 4 | 1 | 2 | Reference |
| 56 | [mat-sz/letterparser](https://github.com/mat-sz/letterparser) | **54** | 10 | 7 | 1 | 15 | 7 | 4 | 9 | 1 | Reference |
| 57 | [zapier/email-reply-parser](https://github.com/zapier/email-reply-parser) | **54** | 12 | 7 | 1 | 15 | 8 | 4 | 5 | 2 | Reference |
| 58 | [rustmailer/bichon](https://github.com/rustmailer/bichon) | **52** | 7 | 9 | 15 | 4 | 6 | 7 | 1 | 3 | Avoid |
| 59 | [Sh4yy/cloudflare-email](https://github.com/Sh4yy/cloudflare-email) | **51** | 8 | 5 | 6 | 15 | 5 | 0 | 9 | 3 | Avoid |
| 60 | [Lakshay1509/NeatMail](https://github.com/Lakshay1509/NeatMail) | **48** | 13 | 8 | 12 | 2 | 6 | 3 | 3 | 1 | Avoid (licence) |
| 61 | [Billionmail/BillionMail](https://github.com/Billionmail/BillionMail) | **45** | 6 | 8 | 9 | 4 | 6 | 7 | 1 | 4 | Avoid |
| 62 | [laudspeaker/laudspeaker](https://github.com/laudspeaker/laudspeaker) | **45** | 6 | 9 | 9 | 2 | 7 | 8 | 1 | 3 | Avoid |
| 63 | [mscdex/node-imap](https://github.com/mscdex/node-imap) | **42** | 6 | 6 | 1 | 15 | 6 | 4 | 1 | 3 | Avoid |
| 64 | [rustmailer/rustmailer](https://github.com/rustmailer/rustmailer) | **41** | 9 | 8 | 12 | 2 | 5 | 2 | 1 | 2 | Avoid (licence) |
| 65 | [PaulleDemon/Email-automation](https://github.com/PaulleDemon/Email-automation) | **34** | 9 | 5 | 9 | 4 | 5 | 0 | 1 | 1 | Avoid |

**Total repositories evaluated in this report: 65.**


## Repository details

### 1. [panva/oauth4webapi](https://github.com/panva/oauth4webapi) — 88/100

- **Purpose:** Spec-compliant OAuth 2/OIDC client for any Web-standard runtime
- **GitHub description:** Low-Level OAuth 2 / OpenID Connect Client API for JavaScript Runtimes
- **Stars / forks / open issues+PRs:** 806 / 75 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2022-03-02
- **Primary language / detected stack:** TypeScript / Next.js, Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Any OAuth/OIDC server
- **Engineering signals:** 375 files · 35 test files · 8 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; OpenID certified; SECURITY.md
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** ID-token validation if OIDC sign-in is needed
- **Limitations / reasons not to reuse:** Lower-level API than arctic
- **Decision:** **Reuse (alternative)**

### 2. [postalsys/postal-mime](https://github.com/postalsys/postal-mime) — 87/100

- **Purpose:** MIME email parser for browsers and serverless (Workers-compatible)
- **GitHub description:** Email parser for browser and serverless environments
- **Stars / forks / open issues+PRs:** 569 / 48 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-12 (14 days before check) · created 2021-01-15
- **Primary language / detected stack:** TypeScript / Nodemailer, postal-mime
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Raw RFC822 / Email Workers
- **Engineering signals:** 71 files · 32 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; zero Node deps
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Parse raw Gmail messages (format=raw) incl. attachments & headers (Message-ID, In-Reply-To, References)
- **Limitations / reasons not to reuse:** Parser only
- **Decision:** **Reuse (dependency)**

### 3. [googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client) — 85/100

- **Purpose:** Official Google APIs Node.js client (includes Gmail)
- **GitHub description:** Google's officially supported Node.js client library for accessing Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT (Service Tokens) is included. 
- **Stars / forks / open issues+PRs:** 12,291 / 2,046 / 228 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-18 (8 days before check) · created 2013-03-06
- **Primary language / detected stack:** TypeScript / googleapis
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** All Google APIs via gaxios
- **Engineering signals:** 3708 files · 50 test files · 5 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: yes
- **Security & privacy:** Official, SECURITY.md
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Gmail API type definitions & request shapes
- **Limitations / reasons not to reuse:** Depends on Node APIs (gaxios, http agents); heavy; Workers needs nodejs_compat and still bloats bundle. Call Gmail REST with fetch instead
- **Decision:** **Reference**

### 4. [crisp-oss/email-reply-parser](https://github.com/crisp-oss/email-reply-parser) — 84/100

- **Purpose:** TypeScript reply parser (quotes/signatures) with 350 tests, multilingual
- **GitHub description:** Node library for parsing plain text email content.
- **Stars / forks / open issues+PRs:** 157 / 59 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-12 (14 days before check) · created 2017-06-16
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 368 files · 350 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; pure TS; well tested
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Extract new reply body before classification
- **Limitations / reasons not to reuse:** Heuristic; fallback to LLM for edge cases
- **Decision:** **Reuse (dependency)**

### 5. [resend/react-email](https://github.com/resend/react-email) — 84/100

- **Purpose:** React components for building and previewing emails
- **GitHub description:** 💌 Build and send emails using React
- **Stars / forks / open issues+PRs:** 20,007 / 1,122 / 36 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2022-09-19
- **Primary language / detected stack:** TypeScript / React, Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Any sender
- **Engineering signals:** 1822 files · 238 test files · 11 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; 238 tests
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Transactional/system notification templates (digests, alerts)
- **Limitations / reasons not to reuse:** Not for personal application emails (plain text is better for deliverability)
- **Decision:** **Reuse (system emails)**

### 6. [choyiny/saasmail](https://github.com/choyiny/saasmail) — 83/100

- **Purpose:** Self-hosted email for SaaS teams on Workers (Hono, Drizzle, D1)
- **GitHub description:** Self-hosted email server for SaaS teams on Cloudflare Workers with WebMCP support
- **Stars / forks / open issues+PRs:** 282 / 55 / 19 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-30 (27 days before check) · created 2026-04-15
- **Primary language / detected stack:** TypeScript / Hono, React, Drizzle, Playwright, postal-mime, Wrangler
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: library / local
- **Data sources & integrations:** Cloudflare Email Routing; D1; Hono
- **Engineering signals:** 738 files · 174 test files · 7 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Apache-2.0; 174 tests; SECURITY.md
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Hono + Drizzle + D1 project structure, thread grouping, Playwright E2E setup
- **Limitations / reasons not to reuse:** Not Gmail-based
- **Decision:** **Adapt**

### 7. [dahlia/upyo](https://github.com/dahlia/upyo) — 82/100

- **Purpose:** Cross-runtime TypeScript email sending library (SMTP, Mailgun, SES, Resend…)
- **GitHub description:** Upyo is a simple and cross-runtime library for sending email messages using SMTP and various email providers.  It works on Node.js, Deno, Bun, and edge functions.
- **Stars / forks / open issues+PRs:** 589 / 17 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-17 (9 days before check) · created 2025-07-11
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** ESP APIs
- **Engineering signals:** 487 files · 123 test files · 1 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; 123 tests; SECURITY.md
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** Transport abstraction pattern; could send system mail
- **Limitations / reasons not to reuse:** No Gmail-API transport for user mailboxes
- **Decision:** **Reference**

### 8. [nodemailer/nodemailer](https://github.com/nodemailer/nodemailer) — 81/100

- **Purpose:** De-facto Node SMTP sending library with attachments and MIME
- **GitHub description:** ✉️ Send e-mails with Node.JS – easy as cake!
- **Stars / forks / open issues+PRs:** 17,718 / 1,449 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2011-01-19
- **Primary language / detected stack:** TypeScript / Nodemailer
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** SMTP, SES, sendmail
- **Engineering signals:** 187 files · 96 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; mature; SECURITY.md
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** MIME building concepts
- **Limitations / reasons not to reuse:** Requires Node net/tls sockets; not Workers-native. Gmail API send avoids SMTP entirely
- **Decision:** **Reference**

### 9. [pilcrowonpaper/arctic](https://github.com/pilcrowonpaper/arctic) — 79/100

- **Purpose:** Minimal OAuth 2.0 clients for 50+ providers incl. Google, runtime-agnostic
- **GitHub description:** OAuth 2.0 clients for popular providers
- **Stars / forks / open issues+PRs:** 1,718 / 97 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-10 (16 days before check) · created 2023-11-02
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Google OAuth
- **Engineering signals:** 15 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** MIT; Web Crypto/fetch only
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Google authorization-code + PKCE + refresh-token flow on Workers
- **Limitations / reasons not to reuse:** Thin; no tests in tree (tests in separate packages)
- **Decision:** **Reuse (dependency)**

### 10. [postalsys/imapflow](https://github.com/postalsys/imapflow) — 78/100

- **Purpose:** Modern IMAP client (used by EmailEngine)
- **GitHub description:** IMAP Client library for EmailEngine Email API (https://emailengine.app)
- **Stars / forks / open issues+PRs:** 586 / 88 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2020-01-14
- **Primary language / detected stack:** TypeScript / Playwright, Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** IMAP servers
- **Engineering signals:** 232 files · 135 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; 135 tests
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Long-lived TCP sessions don't fit Workers request model; Gmail API preferred
- **Decision:** **Reference**

### 11. [axllent/mailpit](https://github.com/axllent/mailpit) — 77/100

- **Purpose:** Modern email testing tool with API
- **GitHub description:** An email and SMTP testing tool with API for developers
- **Stars / forks / open issues+PRs:** 11,041 / 381 / 4 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2022-07-29
- **Primary language / detected stack:** Go / Next.js, Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP; API
- **Engineering signals:** 346 files · 132 test files · 8 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; SECURITY.md; 132 tests
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Local dev email testing in docker-compose (optional)
- **Limitations / reasons not to reuse:** Dev tool only
- **Decision:** **Reuse (dev only)**

### 12. [nodemailer/mailparser](https://github.com/nodemailer/mailparser) — 77/100

- **Purpose:** Streaming MIME parser for Node
- **GitHub description:** Decode mime formatted e-mails
- **Stars / forks / open issues+PRs:** 1,673 / 288 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2010-10-07
- **Primary language / detected stack:** TypeScript / Nodemailer
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Raw RFC822
- **Engineering signals:** 82 files · 34 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; mature
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Node streams; use postal-mime (same author) on Workers
- **Decision:** **Reference**

### 13. [zou-yu/worker-mailer](https://github.com/zou-yu/worker-mailer) — 77/100

- **Purpose:** SMTP client for Workers via cloudflare:sockets
- **GitHub description:** An SMTP library that helps you send email in Cloudflare Workers.
- **Stars / forks / open issues+PRs:** 255 / 40 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-03 (23 days before check) · created 2024-07-26
- **Primary language / detected stack:** TypeScript / Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Any SMTP server
- **Engineering signals:** 33 files · 8 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; tests + CI
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Socket-based SMTP if a non-Gmail provider is later supported
- **Limitations / reasons not to reuse:** Gmail SMTP needs app passwords/XOAUTH2; Gmail API is cleaner
- **Decision:** **Reference**

### 14. [resend/resend-node](https://github.com/resend/resend-node) — 76/100

- **Purpose:** Resend API SDK (fetch-based)
- **GitHub description:** Resend's Official Node.js SDK
- **Stars / forks / open issues+PRs:** 986 / 102 / 21 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2022-07-31
- **Primary language / detected stack:** TypeScript / React, postal-mime
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Resend
- **Engineering signals:** 404 files · 58 test files · 10 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** Platform notifications (sign-in links, digests) if Cloudflare Email Service unavailable
- **Limitations / reasons not to reuse:** External ESP, optional
- **Decision:** **Reuse (system emails, optional)**

### 15. [mibgb65-cloud/OmniMail](https://github.com/mibgb65-cloud/OmniMail) — 75/100

- **Purpose:** Multi-domain webmail on Workers, D1, R2, Queues
- **GitHub description:** Self-hosted multi-domain webmail on Cloudflare Workers, D1, R2, Queues, Email Routing, and Resend.
- **Stars / forks / open issues+PRs:** 281 / 245 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-16 (41 days before check) · created 2026-07-27
- **Primary language / detected stack:** TypeScript / Hono, React, Playwright, postal-mime, Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Cloudflare D1; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Cloudflare Email Routing, D1, R2, Queues
- **Engineering signals:** 1092 files · 221 test files · 5 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** 221 tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** D1 schema for messages/threads, R2 attachment storage, Queue consumers
- **Limitations / reasons not to reuse:** Domain-mail product, not Gmail; MIT so adaptable
- **Decision:** **Reference**

### 16. [elie222/inbox-zero](https://github.com/elie222/inbox-zero) — 74/100

- **Purpose:** AI email assistant for Gmail/Outlook: rules, categorisation, reply tracking, cold-email blocking
- **GitHub description:** The world's best AI personal assistant for email. Open source app to help you reach inbox zero fast.
- **Stars / forks / open issues+PRs:** 13,125 / 1,697 / 134 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2023-07-12
- **Primary language / detected stack:** TypeScript / —
- **Licence:** AGPL-3.0 + additional terms — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Gmail API (history, watch/PubSub), MS Graph; Prisma/Postgres; LLMs
- **Engineering signals:** 5167 files · 1532 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** AGPL-3.0 + additional terms; CASA-scale security work
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Gmail history sync, batch-with-retry, thread completion, label management, reply-tracking concepts (apps/web/utils/gmail/*)
- **Limitations / reasons not to reuse:** AGPL: copying would force AGPL on JobFlow SaaS. Use as architectural reference only
- **Decision:** **Reference (AGPL)**

### 17. [postalserver/postal](https://github.com/postalserver/postal) — 73/100

- **Purpose:** Self-hosted mail delivery platform (Ruby)
- **GitHub description:** 📮 A fully featured open source mail delivery platform for incoming & outgoing e-mail
- **Stars / forks / open issues+PRs:** 16,982 / 1,325 / 95 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2017-04-19
- **Primary language / detected stack:** Ruby / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP; MariaDB; RabbitMQ
- **Engineering signals:** 603 files · 84 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** MIT; SECURITY.md
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Bounce/webhook design ideas
- **Limitations / reasons not to reuse:** Server infrastructure outside Cloudflare; JobFlow sends from user's Gmail
- **Decision:** **Avoid**

### 18. [postalsys/mailauth](https://github.com/postalsys/mailauth) — 73/100

- **Purpose:** SPF/DKIM/DMARC/ARC/BIMI verification and signing
- **GitHub description:** Command line utility and a Node.js library for email authentication
- **Stars / forks / open issues+PRs:** 151 / 25 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-17 (9 days before check) · created 2020-08-17
- **Primary language / detected stack:** TypeScript / Nodemailer
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** DNS
- **Engineering signals:** 298 files · 172 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; 172 tests
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Deliverability diagnostics (domain checks)
- **Limitations / reasons not to reuse:** Not needed when sending via user's Gmail
- **Decision:** **Reference**

### 19. [github/email_reply_parser](https://github.com/github/email_reply_parser) — 72/100

- **Purpose:** Strips quoted replies/signatures from plain-text email
- **GitHub description:** Small library to parse plain text email content
- **Stars / forks / open issues+PRs:** 709 / 156 / 31 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-18 (69 days before check) · created 2011-02-23
- **Primary language / detected stack:** Ruby / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 35 files · 23 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: yes
- **Security & privacy:** MIT; Ruby
- **Cloudflare Workers compatibility (6/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Algorithm for isolating new reply text (port to TS)
- **Limitations / reasons not to reuse:** Ruby; English-centric heuristics
- **Decision:** **Adapt**

### 20. [pimalaya/himalaya](https://github.com/pimalaya/himalaya) — 71/100

- **Purpose:** CLI email client (Rust)
- **GitHub description:** CLI to manage emails
- **Stars / forks / open issues+PRs:** 7,710 / 273 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2020-12-23
- **Primary language / detected stack:** Rust / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** IMAP/SMTP/Maildir
- **Engineering signals:** 1444 files · 54 test files · 4 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** CLI
- **Decision:** **Reference**

### 21. [haraka/Haraka](https://github.com/haraka/Haraka) — 70/100

- **Purpose:** Event-driven SMTP server
- **GitHub description:** A fast, highly extensible, and event driven SMTP server
- **Stars / forks / open issues+PRs:** 5,645 / 720 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-23 (3 days before check) · created 2011-03-10
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Redis; deploy: Docker
- **Data sources & integrations:** SMTP
- **Engineering signals:** 282 files · 93 test files · 4 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Server infra
- **Decision:** **Avoid**

### 22. [mailgun/talon](https://github.com/mailgun/talon) — 69/100

- **Purpose:** Quotation & signature extraction (ML + heuristics)
- **GitHub description:** —
- **Stars / forks / open issues+PRs:** 1,352 / 301 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-16 (41 days before check) · created 2014-07-24
- **Primary language / detected stack:** Python / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 102 files · 65 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Signature detection heuristics
- **Limitations / reasons not to reuse:** Python, scikit-learn
- **Decision:** **Reference**

### 23. [mjmlio/mjml](https://github.com/mjmlio/mjml) — 69/100

- **Purpose:** Responsive HTML email markup language
- **GitHub description:** MJML: the only framework that makes responsive email easy
- **Stars / forks / open issues+PRs:** 18,304 / 1,007 / 61 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-23 (34 days before check) · created 2016-01-28
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 247 files · 42 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Application emails should be plain/light HTML personal messages, not marketing layouts
- **Decision:** **Reference**

### 24. [nikolausm/imap-mcp-server](https://github.com/nikolausm/imap-mcp-server) — 69/100

- **Purpose:** IMAP/SMTP MCP server for AI assistants
- **GitHub description:** Full-featured IMAP & SMTP email for AI assistants: search, read, send, organize and clean up multiple mailboxes, with AES-256-encrypted credentials. Works with Claude, Cursor and any MCP client.
- **Stars / forks / open issues+PRs:** 140 / 64 / 26 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-23 (3 days before check) · created 2025-07-17
- **Primary language / detected stack:** TypeScript / Hono, Nodemailer, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** IMAP/SMTP
- **Engineering signals:** 96 files · 45 test files · 5 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT; 45 tests
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Node sockets
- **Decision:** **Reference**

### 25. [skyphusion-labs/postern](https://github.com/skyphusion-labs/postern) — 69/100

- **Purpose:** Self-hostable email for humans and agents on Cloudflare
- **GitHub description:** Self-hostable email for humans and agents on Cloudflare: send, receive, search, MCP, IMAP, and webmail. Identity-bound credentials (v1.4).
- **Stars / forks / open issues+PRs:** 13 / 2 / 10 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2026-06-05
- **Primary language / detected stack:** TypeScript / —
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Email Routing, D1, R2
- **Engineering signals:** 512 files · 250 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** AGPL-3.0; 250 tests
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Workers mail architecture
- **Limitations / reasons not to reuse:** AGPL
- **Decision:** **Reference (AGPL)**

### 26. [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox) — 68/100

- **Purpose:** Self-hosted email client with AI agent running entirely on Cloudflare (Email Routing, DO, Workers AI)
- **GitHub description:** A self-hosted email client with an AI agent, running entirely on Cloudflare Workers
- **Stars / forks / open issues+PRs:** 8,844 / 1,165 / 65 (checked 2026-11-26)
- **Last commit on default branch:** 2026-04-17 (223 days before check) · created 2026-04-10
- **Primary language / detected stack:** TypeScript / Hono, React, Drizzle, postal-mime, Wrangler
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Cloudflare Email Service binding, Durable Objects (SQLite), Workers AI, postal-mime
- **Engineering signals:** 73 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Apache-2.0; official Cloudflare; no tests in tree
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Durable-Object-per-mailbox pattern, email-sender.ts, agent tool wiring, Drizzle on DO SQLite
- **Limitations / reasons not to reuse:** Built for domain mailboxes, not Gmail OAuth; no tests; last commit Apr 2026
- **Decision:** **Adapt**

### 27. [maildev/maildev](https://github.com/maildev/maildev) — 68/100

- **Purpose:** Local SMTP catcher + web UI for testing
- **GitHub description:** :mailbox: SMTP Server + Web Interface for viewing and testing emails during development.
- **Stars / forks / open issues+PRs:** 6,165 / 570 / 52 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-24 (63 days before check) · created 2013-03-31
- **Primary language / detected stack:** TypeScript / Hono, Nodemailer
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP
- **Engineering signals:** 206 files · 37 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Local dev email testing
- **Limitations / reasons not to reuse:** Dev tool only
- **Decision:** **Reuse (dev only)**

### 28. [warmbly/warmbly](https://github.com/warmbly/warmbly) — 68/100

- **Purpose:** Cold outreach + email warm-up service
- **GitHub description:** The largest open-source B2B cold outreach and email warmup service.
- **Stars / forks / open issues+PRs:** 1,110 / 199 / 20 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2026-01-17
- **Primary language / detected stack:** Go / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Multiple mailboxes
- **Engineering signals:** 8235 files · 1397 test files · 12 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Warm-up networks manipulate reputation signals; spam risk
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Throttling ideas only
- **Limitations / reasons not to reuse:** Contradicts JobFlow anti-spam principles
- **Decision:** **Avoid**

### 29. [eleith/emailjs](https://github.com/eleith/emailjs) — 67/100

- **Purpose:** SMTP sending with HTML and attachments for Node
- **GitHub description:** html emails and attachments to any smtp server with nodejs
- **Stars / forks / open issues+PRs:** 2,207 / 231 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-16 (10 days before check) · created 2011-02-23
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP
- **Engineering signals:** 55 files · 23 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT; 23 tests
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** MIME composition ideas
- **Limitations / reasons not to reuse:** Node sockets
- **Decision:** **Reference**

### 30. [googleapis/google-auth-library-nodejs](https://github.com/googleapis/google-auth-library-nodejs) — 66/100 — **ARCHIVED**

- **Purpose:** Official Google OAuth2/service-account auth library for Node
- **GitHub description:** 🔑 Google Auth Library for Node.js
- **Stars / forks / open issues+PRs:** 1,881 / 406 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2025-11-20 (371 days before check) · created 2015-02-11
- **Primary language / detected stack:** TypeScript / Puppeteer, googleapis
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Google OAuth endpoints
- **Engineering signals:** 246 files · 74 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: yes
- **Security & privacy:** Official
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Token refresh semantics reference
- **Limitations / reasons not to reuse:** Node-specific; use Web-standard OAuth (oauth4webapi/arctic) on Workers
- **Decision:** **Reference**

### 31. [jhillyerd/enmime](https://github.com/jhillyerd/enmime) — 66/100

- **Purpose:** Go MIME encode/decode
- **GitHub description:** MIME mail encoding and decoding package for Go
- **Stars / forks / open issues+PRs:** 528 / 132 / 21 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-19 (7 days before check) · created 2016-11-17
- **Primary language / detected stack:** Go / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 222 files · 42 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Go
- **Decision:** **Reference**

### 32. [jstedfast/MimeKit](https://github.com/jstedfast/MimeKit) — 66/100

- **Purpose:** .NET MIME library with S/MIME/PGP
- **GitHub description:** A .NET MIME creation and parser library with support for S/MIME, PGP, DKIM, TNEF and Unix mbox spools.
- **Stars / forks / open issues+PRs:** 2,015 / 392 / 9 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2012-10-29
- **Primary language / detected stack:** C# / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** —
- **Engineering signals:** 1602 files · 0 test files · 5 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: no · dependency bot: yes
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** RFC-correctness reference
- **Limitations / reasons not to reuse:** .NET
- **Decision:** **Reference**

### 33. [reacherhq/check-if-email-exists](https://github.com/reacherhq/check-if-email-exists) — 66/100

- **Purpose:** SMTP-probe email verification
- **GitHub description:** Check if an email address exists without sending any email, written in Rust. Comes with a ⚙️ HTTP backend.
- **Stars / forks / open issues+PRs:** 10,549 / 798 / 65 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2017-04-25
- **Primary language / detected stack:** Rust / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP RCPT probing
- **Engineering signals:** 176 files · 2 test files · 4 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Probing mail servers can be abusive and is often blocked; AGPL
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Use only publicly listed addresses; never guess-and-probe
- **Decision:** **Avoid**

### 34. [codefuturist/email-mcp](https://github.com/codefuturist/email-mcp) — 65/100

- **Purpose:** MCP server with IMAP+SMTP, scheduling, AI triage
- **GitHub description:** Email MCP server with full IMAP + SMTP support — read, search, send, manage, and organize email from any AI assistant via the Model Context Protocol
- **Stars / forks / open issues+PRs:** 166 / 71 / 45 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-16 (41 days before check) · created 2026-02-18
- **Primary language / detected stack:** TypeScript / Anthropic SDK, Nodemailer
- **Licence:** LGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** IMAP/SMTP
- **Engineering signals:** 262 files · 81 test files · 6 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** LGPL-3.0; SECURITY.md; 81 tests
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Scheduling + triage tool design
- **Limitations / reasons not to reuse:** LGPL; Node sockets
- **Decision:** **Reference (LGPL)**

### 35. [forwardemail/email-templates](https://github.com/forwardemail/email-templates) — 65/100

- **Purpose:** Create, preview and send templated emails
- **GitHub description:** Create, preview (browser/iOS Simulator), and send custom email templates for Node.js.  Made for @forwardemail, @ladjs, @cabinjs, @spamscanner, and @breejs.
- **Stars / forks / open issues+PRs:** 3,744 / 335 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-08-27 (91 days before check) · created 2012-06-15
- **Primary language / detected stack:** JavaScript / Nodemailer
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Nodemailer; Pug etc.
- **Engineering signals:** 36 files · 13 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Template preview/workflow ideas
- **Limitations / reasons not to reuse:** Node-oriented; we use simpler template engine
- **Decision:** **Reference**

### 36. [KartikTalwar/gmail.js](https://github.com/KartikTalwar/gmail.js) — 65/100

- **Purpose:** Browser-extension API for Gmail web UI DOM
- **GitHub description:** Gmail JavaScript API
- **Stars / forks / open issues+PRs:** 3,842 / 455 / 72 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2013-09-17
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Gmail web UI internals
- **Engineering signals:** 29 files · 14 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Relies on undocumented Gmail UI internals
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Brittle, unofficial
- **Decision:** **Avoid**

### 37. [n8n-io/n8n](https://github.com/n8n-io/n8n) — 65/100

- **Purpose:** Workflow automation platform with Gmail nodes
- **GitHub description:** Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.
- **Stars / forks / open issues+PRs:** 212,197 / 61,668 / 1,278 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2019-06-22
- **Primary language / detected stack:** TypeScript / Playwright, LangChain
- **Licence:** Sustainable Use License — commercial reuse: restricted / not permitted
- **Database / hosting signals:** SQLite; deploy: Docker
- **Data sources & integrations:** 400+ integrations
- **Engineering signals:** 36736 files · 14013 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Sustainable Use License (not OSI open source)
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Gmail node behaviour as reference; users can integrate via webhook
- **Limitations / reasons not to reuse:** Licence restricts commercial embedding; heavy server
- **Decision:** **Reference**

### 38. [postalsys/emailengine](https://github.com/postalsys/emailengine) — 65/100

- **Purpose:** Self-hosted email API over IMAP/SMTP/Gmail/Graph with webhooks
- **GitHub description:** Headless email client
- **Stars / forks / open issues+PRs:** 2,258 / 229 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2020-02-28
- **Primary language / detected stack:** JavaScript / Playwright, Nodemailer
- **Licence:** Commercial (EmailEngine Licence v3.0) — commercial reuse: restricted / not permitted
- **Database / hosting signals:** Redis; deploy: Docker
- **Data sources & integrations:** IMAP, Gmail API, MS Graph; Redis
- **Engineering signals:** 1332 files · 540 test files · 4 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Commercial EmailEngine licence (v3.0, Nov 2026)
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Webhook event taxonomy as design reference
- **Limitations / reasons not to reuse:** Commercial licence; Redis + long-running Node server
- **Decision:** **Avoid (licence)**

### 39. [akazwz/smail](https://github.com/akazwz/smail) — 63/100

- **Purpose:** Temporary email with real-time inbox on Workers
- **GitHub description:** Temporary email on Cloudflare Workers, with a real-time inbox. 临时邮箱
- **Stars / forks / open issues+PRs:** 940 / 190 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-05 (21 days before check) · created 2024-01-16
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Email Routing; DO
- **Engineering signals:** 425 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** No tests
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** Realtime inbox via DO WebSocket
- **Limitations / reasons not to reuse:** Temp-mail use case
- **Decision:** **Reference**

### 40. [dittofeed/dittofeed](https://github.com/dittofeed/dittofeed) — 63/100

- **Purpose:** Customer-engagement/journey automation platform
- **GitHub description:** Open-source customer engagement. Automate transactional and marketing messages across email, SMS, mobile push, WhatsApp, Slack, and more 📨
- **Stars / forks / open issues+PRs:** 3,085 / 439 / 72 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-12 (45 days before check) · created 2022-10-01
- **Primary language / detected stack:** TypeScript / React
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** ClickHouse, Postgres, Temporal
- **Engineering signals:** 1476 files · 76 test files · 12 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Journey-state ideas
- **Limitations / reasons not to reuse:** Marketing automation; heavy stack
- **Decision:** **Avoid**

### 41. [Foundry376/Mailspring](https://github.com/Foundry376/Mailspring) — 63/100

- **Purpose:** Desktop mail client
- **GitHub description:** :love_letter: A beautiful, fast and fully open source mail client for Mac, Windows and Linux.
- **Stars / forks / open issues+PRs:** 18,034 / 1,072 / 21 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2016-10-13
- **Primary language / detected stack:** TypeScript / React, Playwright
- **Licence:** GPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** SQLite; deploy: library / local
- **Data sources & integrations:** IMAP/SMTP
- **Engineering signals:** 7209 files · 403 test files · 5 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** GPL-3.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Thread UI ideas
- **Limitations / reasons not to reuse:** GPL desktop app
- **Decision:** **Reference (GPL)**

### 42. [knadh/listmonk](https://github.com/knadh/listmonk) — 61/100

- **Purpose:** Self-hosted newsletter & mailing-list manager (Go)
- **GitHub description:** High performance, self-hosted, newsletter and mailing list manager with a modern dashboard. Single binary app.
- **Stars / forks / open issues+PRs:** 24,469 / 2,834 / 70 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2019-06-26
- **Primary language / detected stack:** Go / —
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP; Postgres
- **Engineering signals:** 487 files · 28 test files · 7 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** AGPL-3.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Template/campaign ideas
- **Limitations / reasons not to reuse:** Bulk marketing tool; wrong model for 1:1 applications
- **Decision:** **Avoid**

### 43. [oiov/vmail](https://github.com/oiov/vmail) — 61/100

- **Purpose:** Temporary mailbox on Workers + D1
- **GitHub description:** 📫 只需一个域名部署临时邮箱到 Cloudflare Worker，支持收发邮件，使用 D1 保存数据，支持多域名后缀，密码找回，开放API接口。
- **Stars / forks / open issues+PRs:** 1,500 / 390 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-21 (5 days before check) · created 2024-04-05
- **Primary language / detected stack:** TypeScript / Hono, Drizzle, postal-mime, Wrangler
- **Licence:** GPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Email Routing; D1; Drizzle
- **Engineering signals:** 192 files · 4 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** GPL-3.0
- **Cloudflare Workers compatibility (10/10):** native / already targets Workers
- **Worth reusing:** Email Worker ingestion pattern
- **Limitations / reasons not to reuse:** GPL; temp-mail use case
- **Decision:** **Reference (GPL)**

### 44. [stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart) — 61/100

- **Purpose:** All-in-one mail & collaboration server (Rust)
- **GitHub description:** All-in-one Mail & Collaboration server. Secure, scalable and fluent in every protocol (IMAP, JMAP, SMTP, CalDAV, CardDAV, WebDAV).
- **Stars / forks / open issues+PRs:** 16,389 / 1,086 / 43 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2023-03-06
- **Primary language / detected stack:** Rust / —
- **Licence:** AGPL-3.0 / SEL dual — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP/IMAP/JMAP
- **Engineering signals:** 2516 files · 38 test files · 7 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** AGPL-3.0 / SEL dual
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Mail server, out of scope
- **Decision:** **Avoid**

### 45. [eracle/OpenOutreach](https://github.com/eracle/OpenOutreach) — 60/100

- **Purpose:** AI agent for B2B lead generation via LinkedIn automation
- **GitHub description:** Open-source AI agent for B2B lead generation — describe your product, it finds the people who fit, explains why each one does, and emails them from your mailbox. Self-hosted CLI, one install.
- **Stars / forks / open issues+PRs:** 3,847 / 683 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2016-10-07
- **Primary language / detected stack:** Python / Django
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** LinkedIn automation
- **Engineering signals:** 42 files · 4 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Automates LinkedIn — ToS risk
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Non-compliant for JobFlow
- **Decision:** **Avoid**

### 46. [mettle/sendportal](https://github.com/mettle/sendportal) — 60/100

- **Purpose:** Self-hosted email marketing (Laravel)
- **GitHub description:** Open-source self-hosted email marketing. Manage your own newsletters at a fraction of the cost. 
- **Stars / forks / open issues+PRs:** 2,193 / 475 / 52 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-22 (35 days before check) · created 2020-06-04
- **Primary language / detected stack:** PHP / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** ESPs
- **Engineering signals:** 183 files · 17 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Bulk marketing model
- **Decision:** **Avoid**

### 47. [ikvk/imap_tools](https://github.com/ikvk/imap_tools) — 59/100

- **Purpose:** Python IMAP helper
- **GitHub description:** Work with email by IMAP
- **Stars / forks / open issues+PRs:** 850 / 96 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-14 (43 days before check) · created 2016-11-17
- **Primary language / detected stack:** Python / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** IMAP
- **Engineering signals:** 688 files · 645 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Apache-2.0; 645 tests
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Python
- **Decision:** **Reference**

### 48. [GAM-team/got-your-back](https://github.com/GAM-team/got-your-back) — 58/100

- **Purpose:** CLI to back up/restore Gmail via Gmail API
- **GitHub description:** Got Your Back (GYB) is a command line tool for backing up your Gmail messages to your computer using Gmail's API over HTTPS.
- **Stars / forks / open issues+PRs:** 3,158 / 254 / 115 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-11 (46 days before check) · created 2014-06-13
- **Primary language / detected stack:** Python / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Gmail API
- **Engineering signals:** 52 files · 0 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Batch/backoff handling for Gmail API quotas
- **Limitations / reasons not to reuse:** Python CLI
- **Decision:** **Reference**

### 49. [s1t5/mail-archiver](https://github.com/s1t5/mail-archiver) — 58/100

- **Purpose:** Web app archiving/searching email
- **GitHub description:** Mail-Archiver is a web application for archiving, searching, and exporting emails from multiple accounts. Featuring folder sync, attachment support, mailbox migration  and a dashboard.
- **Stars / forks / open issues+PRs:** 2,272 / 100 / 27 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2025-05-06
- **Primary language / detected stack:** C# / —
- **Licence:** GPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** IMAP/M365
- **Engineering signals:** 1204 files · 128 test files · 4 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** GPL-3.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Search UX
- **Limitations / reasons not to reuse:** GPL; C#
- **Decision:** **Reference (GPL)**

### 50. [sendgrid/sendgrid-nodejs](https://github.com/sendgrid/sendgrid-nodejs) — 58/100

- **Purpose:** SendGrid API library
- **GitHub description:** The Official Twilio SendGrid Led, Community Driven Node.js API Library
- **Stars / forks / open issues+PRs:** 3,049 / 781 / 103 (checked 2026-11-26)
- **Last commit on default branch:** 2025-09-19 (433 days before check) · created 2012-01-06
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SendGrid
- **Engineering signals:** 218 files · 49 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Third-party ESP; JobFlow sends from user's Gmail
- **Decision:** **Avoid**

### 51. [simonrob/email-oauth2-proxy](https://github.com/simonrob/email-oauth2-proxy) — 58/100

- **Purpose:** IMAP/SMTP proxy adding OAuth 2.0 to legacy clients
- **GitHub description:** An IMAP/POP/SMTP proxy that transparently adds OAuth 2.0 authentication for email clients that don't support this method. Keep legacy email clients working with Exchange Online, Gmail and other providers.
- **Stars / forks / open issues+PRs:** 1,514 / 155 / 3 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-19 (7 days before check) · created 2021-02-12
- **Primary language / detected stack:** Python / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Google/Microsoft OAuth
- **Engineering signals:** 10 files · 0 test files · 0 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Apache-2.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** XOAUTH2 flow reference
- **Limitations / reasons not to reuse:** Desktop proxy
- **Decision:** **Reference**

### 52. [forwardemail/forwardemail.net](https://github.com/forwardemail/forwardemail.net) — 57/100

- **Purpose:** Privacy-focused email service codebase
- **GitHub description:** Open-source, privacy-focused email service for custom domains. Free email forwarding, encrypted mailboxes (IMAP/POP3), SMTP sending, calendars and contacts (CalDAV/CardDAV), webhooks, and an email API. Self-host it with Docker. A private alternative to Gmail, Mailchimp, and SendGrid.
- **Stars / forks / open issues+PRs:** 1,727 / 203 / 29 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2019-12-17
- **Primary language / detected stack:** JavaScript / Puppeteer, Nodemailer, PDF libs
- **Licence:** MPL-2.0 + BSL-1.1 — commercial reuse: restricted / not permitted
- **Database / hosting signals:** SQLite, MongoDB, Redis; deploy: Docker
- **Data sources & integrations:** Full mail stack
- **Engineering signals:** 3742 files · 491 test files · 6 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** MPL-2.0 + BSL portions
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Licence mix; full ESP
- **Decision:** **Avoid (licence)**

### 53. [mailgun/flanker](https://github.com/mailgun/flanker) — 56/100

- **Purpose:** Python email-address and MIME parsing
- **GitHub description:** Python email address and Mime parsing library
- **Stars / forks / open issues+PRs:** 1,646 / 211 / 79 (checked 2026-11-26)
- **Last commit on default branch:** 2026-04-08 (232 days before check) · created 2013-11-14
- **Primary language / detected stack:** Python / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 266 files · 204 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Apache-2.0; no CI
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Address validation rules
- **Limitations / reasons not to reuse:** Python
- **Decision:** **Reference**

### 54. [Notifuse/notifuse](https://github.com/Notifuse/notifuse) — 56/100

- **Purpose:** Self-hosted newsletter/transactional platform (Go)
- **GitHub description:** Open-source, self-hosted newsletter, email marketing and transactional email platform. Visual MJML editor, Liquid templating, 7 sending providers.
- **Stars / forks / open issues+PRs:** 2,310 / 245 / 5 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2025-03-15
- **Primary language / detected stack:** Go / —
- **Licence:** BSL-1.1 (+AGPL SDK) — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP/ESP; Postgres
- **Engineering signals:** 3674 files · 1600 test files · 9 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** BSL 1.1
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Source-available licence
- **Decision:** **Avoid (licence)**

### 55. [jeremyephron/simplegmail](https://github.com/jeremyephron/simplegmail) — 55/100

- **Purpose:** Simple Python Gmail API client
- **GitHub description:** A simple Gmail API client for applications in Python
- **Stars / forks / open issues+PRs:** 412 / 83 / 7 (checked 2026-11-26)
- **Last commit on default branch:** 2026-08-17 (101 days before check) · created 2019-02-28
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Gmail API
- **Engineering signals:** 20 files · 4 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** MIT
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Query builder ideas for Gmail search syntax
- **Limitations / reasons not to reuse:** Python
- **Decision:** **Reference**

### 56. [mat-sz/letterparser](https://github.com/mat-sz/letterparser) — 54/100

- **Purpose:** Isomorphic TS email parser
- **GitHub description:** ✉️ Isomorphic e-mail parser (with MIME support) written in TypeScript.
- **Stars / forks / open issues+PRs:** 52 / 3 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2024-09-19 (798 days before check) · created 2020-04-01
- **Primary language / detected stack:** TypeScript / —
- **Licence:** BSD-3-Clause-Clear — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 20 files · 3 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** BSD-3-Clause-Clear; stale since 2024
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** postal-mime is better maintained
- **Decision:** **Reference**

### 57. [zapier/email-reply-parser](https://github.com/zapier/email-reply-parser) — 54/100

- **Purpose:** Python port of email_reply_parser
- **GitHub description:** :email: Email reply parser library for Python
- **Stars / forks / open issues+PRs:** 529 / 116 / 18 (checked 2026-11-26)
- **Last commit on default branch:** 2020-10-07 (2241 days before check) · created 2012-11-02
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** —
- **Engineering signals:** 37 files · 26 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** MIT; last commit 2020
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Stale
- **Decision:** **Reference**

### 58. [rustmailer/bichon](https://github.com/rustmailer/bichon) — 52/100

- **Purpose:** Rust email archiver with web UI
- **GitHub description:** Bichon – A lightweight, high-performance Rust email archiver with WebUI
- **Stars / forks / open issues+PRs:** 2,107 / 96 / 22 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2025-11-18
- **Primary language / detected stack:** Rust / —
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** IMAP
- **Engineering signals:** 843 files · 58 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** AGPL-3.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Full-text search design
- **Limitations / reasons not to reuse:** AGPL
- **Decision:** **Avoid**

### 59. [Sh4yy/cloudflare-email](https://github.com/Sh4yy/cloudflare-email) — 51/100

- **Purpose:** Proxy for free transactional email via MailChannels on Workers
- **GitHub description:** This is a simple proxy server that can be used for sending free transactional emails through Cloudflare workers.
- **Stars / forks / open issues+PRs:** 1,600 / 358 / 13 (checked 2026-11-26)
- **Last commit on default branch:** 2025-12-01 (360 days before check) · created 2023-06-14
- **Primary language / detected stack:** TypeScript / Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** MailChannels (free tier ended 2024)
- **Engineering signals:** 16 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** No tests
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Dependent on discontinued free MailChannels path
- **Decision:** **Avoid**

### 60. [Lakshay1509/NeatMail](https://github.com/Lakshay1509/NeatMail) — 48/100

- **Purpose:** AI Gmail/Outlook assistant tracking promises and follow-ups
- **GitHub description:** AI email assistant for Gmail and Outlook that tracks every promise in your inbox and drafts the follow-up. Auto-labels mail and drafts replies in your voice. Source-available (ELv2), self-hostable.
- **Stars / forks / open issues+PRs:** 146 / 19 / 4 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-25 (32 days before check) · created 2026-01-04
- **Primary language / detected stack:** TypeScript / Next.js, Hono, React, Prisma, OpenAI SDK, googleapis
- **Licence:** Elastic-2.0 — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Gmail API, Prisma, OpenAI
- **Engineering signals:** 460 files · 0 test files · 8 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Elastic License 2.0 (no SaaS hosting)
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Follow-up detection idea
- **Limitations / reasons not to reuse:** ELv2 forbids offering as managed service
- **Decision:** **Avoid (licence)**

### 61. [Billionmail/BillionMail](https://github.com/Billionmail/BillionMail) — 45/100

- **Purpose:** Mail server + newsletter platform
- **GitHub description:** BillionMail gives you open-source MailServer, NewsLetter,  Email Marketing — fully self-hosted, dev-friendly, and free from monthly fees. Join the discord: https://discord.gg/asfXzBUhZr
- **Stars / forks / open issues+PRs:** 16,482 / 1,838 / 261 (checked 2026-11-26)
- **Last commit on default branch:** 2026-06-11 (168 days before check) · created 2025-02-14
- **Primary language / detected stack:** Go / —
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** SMTP stack
- **Engineering signals:** 1484 files · 110 test files · 0 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** AGPL-3.0
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Bulk mail; AGPL
- **Decision:** **Avoid**

### 62. [laudspeaker/laudspeaker](https://github.com/laudspeaker/laudspeaker) — 45/100

- **Purpose:** Customer engagement/journey platform
- **GitHub description:** 📢 Laudspeaker is an Open Source Customer Engagement and Product Onboarding Platform. Open Source alternative to  Braze /  One Signal / Customer Io / Appcues / Pendo . Use Laudspeaker to design product onboarding flows and send product and event triggered emails, sms, push and more. 
- **Stars / forks / open issues+PRs:** 2,636 / 206 / 33 (checked 2026-11-26)
- **Last commit on default branch:** 2026-07-10 (139 days before check) · created 2022-10-06
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT + ee/ commercial — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** ESPs
- **Engineering signals:** 1406 files · 154 test files · 12 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** MIT + EE portions
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Marketing automation
- **Decision:** **Avoid**

### 63. [mscdex/node-imap](https://github.com/mscdex/node-imap) — 42/100

- **Purpose:** Legacy Node IMAP client
- **GitHub description:** An IMAP client module for node.js.
- **Stars / forks / open issues+PRs:** 2,221 / 382 / 194 (checked 2026-11-26)
- **Last commit on default branch:** 2022-02-17 (1743 days before check) · created 2010-10-04
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** IMAP
- **Engineering signals:** 20 files · 12 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Unmaintained since 2022
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Stale
- **Decision:** **Avoid**

### 64. [rustmailer/rustmailer](https://github.com/rustmailer/rustmailer) — 41/100

- **Purpose:** Email middleware over IMAP/SMTP/Gmail/Graph
- **GitHub description:** A self-hosted Email Middleware for IMAP, SMTP, Gmail API, Graph API — built for developers
- **Stars / forks / open issues+PRs:** 530 / 42 / 11 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-16 (41 days before check) · created 2025-07-17
- **Primary language / detected stack:** Rust / —
- **Licence:** Custom proprietary-style — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Gmail, Graph
- **Engineering signals:** 604 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Custom restrictive licence
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** Proprietary-style licence
- **Decision:** **Avoid (licence)**

### 65. [PaulleDemon/Email-automation](https://github.com/PaulleDemon/Email-automation) — 34/100

- **Purpose:** Cold email outreach tool (Django)
- **GitHub description:** open-source cold email outreach tool
- **Stars / forks / open issues+PRs:** 192 / 39 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-08-20 (98 days before check) · created 2023-10-03
- **Primary language / detected stack:** JavaScript / Django
- **Licence:** AGPL-3.0 + extra clauses — commercial reuse: copyleft obligations
- **Database / hosting signals:** Redis; deploy: library / local
- **Data sources & integrations:** SMTP
- **Engineering signals:** 336 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** AGPL + extra clauses
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** —
- **Limitations / reasons not to reuse:** AGPL; no tests
- **Decision:** **Avoid**
