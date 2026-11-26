# Repository Comparison & Reuse Matrix

> This document turns the research in `job-search-repositories.md`, `email-automation-repositories.md`, `ai-and-automation-repositories.md` and `cloudflare-references.md` into concrete decisions for each JobFlow module. Metrics were checked on 2026-11-26.

## 1. Headline findings

1. **No existing project matches JobFlow's target shape.** The shape is a hosted, multi-user, Cloudflare-native product that combines global discovery, transparent matching, Gmail sending, reply detection and a capped follow-up. The strongest projects are local-first CLIs or agent skills ([career-ops](https://github.com/career-ops-hq/career-ops), [ai-job-search](https://github.com/ai-job-search-dev/ai-job-search)), self-hosted Docker apps ([job-ops](https://github.com/DaKheera47/job-ops), [jobsync](https://github.com/Gsync/jobsync)), or Python scraping libraries ([JobSpy](https://github.com/speedyapply/JobSpy), [ats-scrapers](https://github.com/kalil0321/ats-scrapers)). That gap is JobFlow's opportunity.
2. **The best reuse is at the library layer, not the application layer.** Workers-native, permissively licensed building blocks exist for every infrastructure concern: Hono, Drizzle, Zod, chanfana, better-auth, arctic, postal-mime, crisp-oss/email-reply-parser, unpdf, Readability, the Vercel AI SDK and the Cloudflare Agents SDK. The job-domain logic (ATS adapters, scoring, follow-up rules) has to be **re-implemented in TypeScript**, using Python projects as specifications.
3. **Licences block several attractive codebases:**
   - [inbox-zero](https://github.com/elie222/inbox-zero) (AGPL-3.0 + extra terms)
   - [job-ops](https://github.com/DaKheera47/job-ops) (Commons Clause)
   - [ashby-job-scraper](https://github.com/rishilahoti/ashby-job-scraper) (MIT + Commons Clause)
   - [NeatMail](https://github.com/Lakshay1509/NeatMail) (Elastic-2.0)
   - [EmailEngine](https://github.com/postalsys/emailengine) (commercial)
   - [n8n](https://github.com/n8n-io/n8n) (Sustainable Use License)
   - [open-resume](https://github.com/xitanggg/open-resume) (AGPL)
   - [agentic-career-search](https://github.com/Francis1998/agentic-career-search) (no licence)

   These can be studied but no code may be copied.
4. **Many popular "job automation" repositories are compliance anti-patterns.** Examples: LinkedIn Easy Apply bots using `undetected-chromedriver`, LinkedIn session-driving MCP servers, and JobSpy's scraping of LinkedIn's guest endpoints (`/jobs-guest/jobs/api/seeMoreJobPostings/search`). [ats-scrapers](https://github.com/kalil0321/ats-scrapers) bundles a `cloakbrowser` module that it describes as bypassing "every fingerprint check (Akamai, Cloudflare bot manager, PerimeterX)". JobFlow must take only the public-API adapters from it.
5. **Gmail is the main platform risk, not Cloudflare.** Reading replies needs a Gmail scope that Google classifies as *restricted*, which requires Google's OAuth verification and a third-party security assessment before a public launch (see `docs/architecture/technology-decisions.md`, ADR-007). The open-source, bring-your-own-Google-OAuth-client model removes that barrier for self-hosters on day one.

## 2. Reuse matrix

| JobFlow module | Best reference repository | Reusable functionality | Reuse decision |
|---|---|---|---|
| **LinkedIn-compatible discovery** | [career-ops](https://github.com/career-ops-hq/career-ops) (human-in-the-loop principles, liveness checks). Counter-examples: [JobSpy](https://github.com/speedyapply/JobSpy) LinkedIn module, [Auto_job_applier_linkedIn](https://github.com/GodsScion/Auto_job_applier_linkedIn) | Compliant patterns only: (a) the user pastes or shares a LinkedIn job URL and JobFlow stores the URL plus fields the user confirms; (b) with consent, parse the **LinkedIn job-alert emails already in the user's own Gmail**, then resolve each job to the employer's own ATS posting; (c) "Apply on company site" link resolution through the employer's public ATS board | **Build.** No LinkedIn scraping, no logged-in automation, no guest-endpoint calls |
| **Global job aggregation** | [kalil0321/ats-scrapers](https://github.com/kalil0321/ats-scrapers) (MIT): adapter catalogue, `docs/JOB_SCHEMA.md`, `docs/DISCOVERY_RULES.md`. [plibither8/jobber](https://github.com/plibither8/jobber) (MIT): Worker-native fetchers. [gubidonius/ats-job-boards-reference](https://github.com/gubidonius/ats-job-boards-reference) | Public JSON board endpoints for Greenhouse, Lever, Ashby, SmartRecruiters, Workable, Recruitee, Personio, Teamtailor and Workday (public CXS JSON); job schema field list; company→ATS slug resolution rules | **Adapt.** Re-implement in TypeScript with MIT attribution in `THIRD_PARTY_NOTICES.md`. Exclude cloakbrowser/stealth and HTML-scraping adapters |
| **Company & source seeding** | [remoteintech/remote-jobs](https://github.com/remoteintech/remote-jobs) (ISC), [emredurukn/awesome-job-boards](https://github.com/emredurukn/awesome-job-boards) (CC0), [career-ops](https://github.com/career-ops-hq/career-ops) `discover-ats.mjs` | Company lists and board inventory; ATS vendor fingerprinting from career-page URLs | **Reuse data** (with attribution) **and build** the discovery logic |
| **Career-page & direct-link discovery** | [mozilla/readability](https://github.com/mozilla/readability), [cheerio](https://github.com/cheeriojs/cheerio), [cloudflare/queues-web-crawler](https://github.com/cloudflare/queues-web-crawler) | Fetch the career page, check `robots.txt`, parse `JobPosting` JSON-LD and ATS iframe/links, extract a clean description; queue fan-out with per-domain politeness | **Reuse** Readability/cheerio (or the native HTMLRewriter). **Adapt** the queue crawl pattern (Apache-2.0) |
| **Public recruiter/HR contact discovery** | No compliant OSS reference exists. [check-if-email-exists](https://github.com/reacherhq/check-if-email-exists) is the anti-pattern (SMTP probing) | Extract only addresses **published** in the job posting, JSON-LD `applicationContact`, or the company's careers/contact page. Store the source URL and capture time; show provenance in the UI | **Build.** Never guess email patterns, never SMTP-probe, never fabricate |
| **AI matching & transparent ranking** | [srbhr/Resume-Matcher](https://github.com/srbhr/Resume-Matcher) (Apache-2.0), [career-ops](https://github.com/career-ops-hq/career-ops) (rubric, `role-matcher.mjs`, `jd-skill-gap.mjs`), [vercel/ai](https://github.com/vercel/ai) | Hybrid score: hard filters (location, visa, seniority, salary floor), then lexical overlap with D1 FTS5, then embedding similarity (Workers AI `bge-m3`), then optional LLM rubric for the top N. Every score breaks down into explainable components | **Build**, using Resume-Matcher and career-ops as specifications. **Reuse** AI SDK + Zod for structured outputs |
| **Resume parsing** | [unjs/unpdf](https://github.com/unjs/unpdf) (MIT, Workers-tested), [open-resume](https://github.com/xitanggg/open-resume) (AGPL, *algorithm reference only*), [reactive-resume](https://github.com/reactive-resume/reactive-resume) (schema) | PDF text extraction in the Worker; LLM structured extraction into a JSON-Resume-like schema; the user confirms every field | **Reuse** unpdf. **Build** the extraction schema. Copy no code from open-resume |
| **Tailored resume & cover letter** | [ai-job-search](https://github.com/ai-job-search-dev/ai-job-search) (drafter/reviewer pattern), [Resume-Matcher](https://github.com/srbhr/Resume-Matcher) | Two-pass generation (draft, then a fact-check against the profile so no invented experience), plus keyword-gap suggestions | **Build** (prompts are original). The pattern is inspired by the references |
| **Gmail integration** | [pilcrowonpaper/arctic](https://github.com/pilcrowonpaper/arctic) (MIT), [panva/oauth4webapi](https://github.com/panva/oauth4webapi) (MIT), [better-auth](https://github.com/better-auth/better-auth) (MIT). [inbox-zero](https://github.com/elie222/inbox-zero) `utils/gmail/*` is a *design reference only* | Google OAuth authorization code + PKCE with incremental scopes; refresh-token rotation; Gmail REST via `fetch` (no `googleapis` package, which is Node-bound); batch and backoff | **Reuse** arctic + better-auth. **Build** a thin Gmail REST client |
| **Email sending** | Gmail API `users.messages.send`; MIME building informed by [nodemailer](https://github.com/nodemailer/nodemailer) (MIT); [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox) `email-sender.ts` (Apache-2.0) for system mail | RFC 2822 MIME with a PDF résumé attachment from R2, base64url-encoded for the Gmail API; `In-Reply-To`/`References` headers for the follow-up in the same thread | **Build** a small MIME builder (about 150 LOC, unit tested). **Adapt** the agentic-inbox pattern for system notifications |
| **Reply detection & classification** | [postal-mime](https://github.com/postalsys/postal-mime) (MIT), [crisp-oss/email-reply-parser](https://github.com/crisp-oss/email-reply-parser) (MIT, 350 tests), [github/email_reply_parser](https://github.com/github/email_reply_parser), [mailgun/talon](https://github.com/mailgun/talon) | Gmail `history.list` incremental sync, then thread match on the sent `threadId`. Exclude self-sent messages, auto-replies (`Auto-Submitted`, `X-Autoreply`, `Precedence: bulk/auto_reply`) and bounces (`mailer-daemon`, DSN). Strip quotes, then an LLM classifies the reply as interview / rejection / request-for-info / other | **Reuse** postal-mime + email-reply-parser. **Build** the classifier |
| **Follow-up scheduling** | [cloudflare/agents](https://github.com/cloudflare/agents) (scheduling on Durable Objects), [career-ops](https://github.com/career-ops-hq/career-ops) `followup-cadence.mjs` (policy idea) | Per-user Durable Object (`OutboundGovernor`) with a rolling-24h ledger of 20 messages; one follow-up at ≥24 h only if there is no genuine reply; pause switch; idempotency keys | **Build** on the DO alarm API. Reuse the Agents SDK only if it reduces code |
| **Application tracking** | [Gsync/jobsync](https://github.com/Gsync/jobsync) (MIT), [averatec0773/offeros](https://github.com/averatec0773/offeros) (Apache-2.0) | Pipeline states (saved → prepared → approved → sent → replied → interview → offer / rejected / withdrawn), activity timeline, funnel metrics | **Build** (domain model inspired by both; no code copied) |
| **Browser automation** | [cloudflare/playwright](https://github.com/cloudflare/playwright) on Browser Rendering; [nanobrowser](https://github.com/nanobrowser/nanobrowser) (Apache-2.0) as the model for a future user-side extension | Server side: render JS-only career pages that robots.txt allows, on demand. User side (later): an extension that pre-fills a form **in the user's own browser**, where the user reviews and clicks Submit | **Reuse** cloudflare/playwright (optional). **Defer** the extension to Phase 7+. Never auto-submit, never bypass CAPTCHAs |
| **Cloudflare infrastructure** | [cloudflare/templates](https://github.com/cloudflare/templates), [choyiny/saasmail](https://github.com/choyiny/saasmail) (Apache-2.0: Hono + Drizzle + D1 + Playwright E2E), [mibgb65-cloud/OmniMail](https://github.com/mibgb65-cloud/OmniMail) (MIT: D1 + R2 + Queues), [workers-sdk](https://github.com/cloudflare/workers-sdk) (vitest-pool-workers) | Project layout, wrangler bindings, D1 migrations, Queue consumers, DLQs, local dev with Miniflare | **Adapt** structure. **Reuse** tooling |
| **API layer & docs** | [honojs/hono](https://github.com/honojs/hono), [cloudflare/chanfana](https://github.com/cloudflare/chanfana), [colinhacks/zod](https://github.com/colinhacks/zod) | Routing, validation, OpenAPI 3.1 generation | **Reuse** |
| **Database** | [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) | Typed schema, D1 driver, drizzle-kit SQL migrations applied with `wrangler d1 migrations` | **Reuse** |
| **System notification emails** | [resend/react-email](https://github.com/resend/react-email) (MIT) | Templates for digests and alerts. Sent from the user's Gmail or the Cloudflare Email Service binding | **Reuse** (optional) |
| **Analytics** | [PostHog](https://github.com/PostHog/posthog) and [umami](https://github.com/umami-software/umami) as event-taxonomy references | First-party `events` table in D1 (activation/retention); Cloudflare Web Analytics for the landing page | **Build** (no third-party tracking in v1) |
| **Testing** | [microsoft/playwright](https://github.com/microsoft/playwright), [workers-sdk](https://github.com/cloudflare/workers-sdk) vitest pool, [axllent/mailpit](https://github.com/axllent/mailpit) | E2E, Workers-runtime unit/integration tests, local mail capture | **Reuse** |

## 3. Third-party code policy (applies to every phase)

Before any code derived from a third-party repository enters JobFlow:

1. **Licence check.** Only MIT, Apache-2.0, BSD, ISC, CC0 or MPL-2.0 (file-level) code may be copied or adapted. AGPL, GPL, Commons Clause, BSL, Elastic, Sustainable Use, unlicensed and custom licences mean *reference only*.
2. **Attribution.** Keep the copyright headers in adapted files and list each source in `THIRD_PARTY_NOTICES.md` (repository, commit SHA, licence, files).
3. **Dependency audit.** Run `npm audit --omit=dev` and GitHub dependency review in CI. Pin exact versions; Renovate/Dependabot opens update PRs.
4. **Data-handling review.** Read the auth/token code paths of any dependency that touches credentials before adopting it.
5. **Genuine reusability.** Prefer a 100-line, fully tested re-implementation over importing a large app module.
6. **Abandonment and malice screen.** No dependency with no commits in 18+ months unless it is feature-complete and widely used. Check the npm publisher identity and install scripts.
7. **Terms of service.** No adapter ships without a `terms_reviewed_at` date and a documented access method (official API, public feed, or a robots.txt-permitted public page).

## 4. Shortlist summary

**Direct dependencies (proposed):** hono, chanfana, zod, drizzle-orm (+ drizzle-kit), better-auth, arctic, postal-mime, email-reply-parser (crisp-oss), unpdf, @mozilla/readability + linkedom (or HTMLRewriter), ai (Vercel AI SDK) + workers-ai-provider, agents (Cloudflare, optional), react, react-router, tailwindcss, @radix-ui primitives, @tanstack/react-query. Dev: wrangler, vitest + @cloudflare/vitest-pool-workers, playwright, eslint, typescript, mailpit (optional docker).

**Adapted with attribution:** ATS endpoint knowledge and job schema (kalil0321/ats-scrapers, MIT), Worker fetcher shape (plibither8/jobber, MIT), queue crawl pattern (cloudflare/queues-web-crawler, Apache-2.0), DO-mailbox and email-sender patterns (cloudflare/agentic-inbox, Apache-2.0), Hono/Drizzle/D1 layout (choyiny/saasmail, Apache-2.0).

**Studied, not copied:** career-ops, ai-job-search, job-ops, jobsync, Resume-Matcher, inbox-zero, offeros, open-resume, reactive-resume.

**Rejected:** every LinkedIn/Indeed/Glassdoor auto-apply bot, LinkedIn session MCP servers, stealth/evasion browsers, SMTP email-probing, cold-email warm-up networks, bulk-marketing platforms.

## 5. Reproducing the research

All scripts are in `scripts/research/`:

```bash
cd scripts/research
./search.sh            # 62 GitHub search queries -> raw.jsonl (needs an authenticated gh CLI)
python3 fetchmeta.py   # verified metadata for curated.txt -> meta.json
awk '{print $2}' curated.txt | xargs -P 8 -I{} ./inspect.sh {}   # tree-only clone signals -> trees/
python3 gen.py         # regenerates the four ranked research documents
```

The queries are in `scripts/research/queries.txt`. The analyst judgements (relevance, code quality, security, Cloudflare compatibility, decision and notes) are in `scripts/research/judg_*.txt`, so anyone can challenge or change a score and regenerate the documents.
