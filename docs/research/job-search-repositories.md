# Job-Search & Recruitment Repository Research

> Metrics checked on **2026-11-26** via the GitHub REST search API and shallow, blob-less git clones of each repository. Stars/forks/issues change daily; re-run `scripts/research/` (see methodology) to refresh.

Scope: LinkedIn-related discovery, AI job agents, aggregators, remote boards, career-page crawlers, Greenhouse/Lever/Ashby/Workday integrations, matching, resume tailoring, cover letters, auto-apply bots (evaluated as anti-patterns), trackers, recruiter discovery, alerts, Playwright workflows, MCP job tools and job-feed APIs.


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
| 1 | [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) | **88** | 19 | 12 | 15 | 15 | 8 | 10 | 4 | 5 | Reference |
| 2 | [reactive-resume/reactive-resume](https://github.com/reactive-resume/reactive-resume) | **86** | 14 | 13 | 15 | 15 | 8 | 10 | 6 | 5 | Reference |
| 3 | [srbhr/Resume-Matcher](https://github.com/srbhr/Resume-Matcher) | **82** | 17 | 11 | 15 | 15 | 7 | 9 | 3 | 5 | Adapt |
| 4 | [Gsync/jobsync](https://github.com/Gsync/jobsync) | **81** | 17 | 12 | 15 | 15 | 7 | 9 | 3 | 3 | Reference |
| 5 | [kalil0321/ats-scrapers](https://github.com/kalil0321/ats-scrapers) | **80** | 19 | 12 | 15 | 15 | 5 | 9 | 3 | 2 | Adapt (public-API adapters only) |
| 6 | [ai-job-search-dev/ai-job-search](https://github.com/ai-job-search-dev/ai-job-search) | **79** | 15 | 9 | 15 | 15 | 8 | 10 | 2 | 5 | Reference |
| 7 | [vaibhavarora14/job-application-agent](https://github.com/vaibhavarora14/job-application-agent) | **78** | 15 | 10 | 15 | 15 | 7 | 10 | 5 | 1 | Reference |
| 8 | [ever-co/ever-jobs](https://github.com/ever-co/ever-jobs) | **77** | 15 | 11 | 15 | 15 | 7 | 10 | 3 | 1 | Reference |
| 9 | [sunnypatell/ats-screener](https://github.com/sunnypatell/ats-screener) | **77** | 13 | 9 | 15 | 15 | 8 | 9 | 6 | 2 | Reference |
| 10 | [remoteintech/remote-jobs](https://github.com/remoteintech/remote-jobs) | **76** | 12 | 7 | 15 | 15 | 8 | 7 | 7 | 5 | Reuse (data, with attribution) |
| 11 | [vesaias/JobNavigator](https://github.com/vesaias/JobNavigator) | **74** | 15 | 10 | 15 | 15 | 6 | 10 | 2 | 1 | Reference |
| 12 | [cncf/gitjobs](https://github.com/cncf/gitjobs) | **72** | 11 | 11 | 15 | 15 | 8 | 8 | 3 | 1 | Reference |
| 13 | [craftled/bordful](https://github.com/craftled/bordful) | **72** | 10 | 10 | 15 | 15 | 7 | 10 | 4 | 1 | Reference |
| 14 | [feder-cr/Jobs_Applier_AI_Agent](https://github.com/feder-cr/Jobs_Applier_AI_Agent) | **71** | 14 | 8 | 15 | 15 | 4 | 9 | 1 | 5 | Reference |
| 15 | [amikai/openings-mcp](https://github.com/amikai/openings-mcp) | **70** | 15 | 10 | 12 | 15 | 6 | 8 | 3 | 1 | Reference |
| 16 | [averatec0773/offeros](https://github.com/averatec0773/offeros) | **70** | 15 | 10 | 9 | 15 | 8 | 10 | 3 | 0 | Reference |
| 17 | [lastsunday/job-hunting](https://github.com/lastsunday/job-hunting) | **70** | 12 | 9 | 12 | 15 | 7 | 10 | 3 | 2 | Reference |
| 18 | [LingyiChen-AI/JadeAI](https://github.com/LingyiChen-AI/JadeAI) | **70** | 13 | 10 | 12 | 15 | 6 | 7 | 4 | 3 | Reference |
| 19 | [tarunlnmiit/autopilot-jobhunt](https://github.com/tarunlnmiit/autopilot-jobhunt) | **69** | 15 | 8 | 12 | 15 | 6 | 9 | 2 | 2 | Reference |
| 20 | [suxrobGM/jobpilot](https://github.com/suxrobGM/jobpilot) | **68** | 13 | 9 | 15 | 15 | 4 | 9 | 2 | 1 | Reference |
| 21 | [DaKheera47/job-ops](https://github.com/DaKheera47/job-ops) | **67** | 17 | 12 | 15 | 2 | 7 | 8 | 3 | 3 | Reference (licence) |
| 22 | [matthewprice/JobFinderOS](https://github.com/matthewprice/JobFinderOS) | **66** | 14 | 7 | 15 | 15 | 6 | 6 | 2 | 1 | Reference |
| 23 | [Riley-Dorrington/job-board-aggregator](https://github.com/Riley-Dorrington/job-board-aggregator) | **66** | 15 | 7 | 15 | 15 | 6 | 5 | 2 | 1 | Reference |
| 24 | [speedyapply/JobSpy](https://github.com/speedyapply/JobSpy) | **65** | 17 | 8 | 15 | 15 | 3 | 2 | 2 | 3 | Adapt (non-LinkedIn only) |
| 25 | [alpharomercoma/ts-jobspy](https://github.com/alpharomercoma/ts-jobspy) | **63** | 13 | 9 | 12 | 15 | 3 | 6 | 5 | 0 | Reference |
| 26 | [emredurukn/awesome-job-boards](https://github.com/emredurukn/awesome-job-boards) | **63** | 9 | 3 | 15 | 15 | 9 | 1 | 8 | 3 | Reuse (data) |
| 27 | [BjornMelin/ai-job-scraper](https://github.com/BjornMelin/ai-job-scraper) | **61** | 12 | 8 | 9 | 15 | 7 | 7 | 2 | 1 | Reference |
| 28 | [gubidonius/ats-job-boards-reference](https://github.com/gubidonius/ats-job-boards-reference) | **61** | 12 | 5 | 12 | 15 | 8 | 1 | 8 | 0 | Reference |
| 29 | [jananthan30/Resume-Builder](https://github.com/jananthan30/Resume-Builder) | **61** | 11 | 7 | 9 | 15 | 7 | 9 | 2 | 1 | Reference |
| 30 | [fedorchenko-juli/job_search_tool](https://github.com/fedorchenko-juli/job_search_tool) | **60** | 14 | 7 | 12 | 15 | 6 | 2 | 3 | 1 | Reference |
| 31 | [rishilahoti/ashby-job-scraper](https://github.com/rishilahoti/ashby-job-scraper) | **59** | 13 | 9 | 15 | 2 | 6 | 9 | 4 | 1 | Reference (licence) |
| 32 | [spinlud/py-linkedin-jobs-scraper](https://github.com/spinlud/py-linkedin-jobs-scraper) | **59** | 8 | 8 | 15 | 15 | 2 | 8 | 1 | 2 | Avoid |
| 33 | [DanielPan12/JobHuntBot](https://github.com/DanielPan12/JobHuntBot) | **58** | 12 | 6 | 12 | 15 | 5 | 4 | 2 | 2 | Reference |
| 34 | [Francis1998/agentic-career-search](https://github.com/Francis1998/agentic-career-search) | **58** | 16 | 10 | 15 | 0 | 5 | 9 | 2 | 1 | Reference (no licence) |
| 35 | [espin086/GPT-Jobhunter](https://github.com/espin086/GPT-Jobhunter) | **56** | 11 | 6 | 9 | 15 | 5 | 7 | 2 | 1 | Reference |
| 36 | [Paramchoudhary/ResumeSkills](https://github.com/Paramchoudhary/ResumeSkills) | **55** | 10 | 4 | 9 | 15 | 8 | 1 | 5 | 3 | Reference |
| 37 | [adgramigna/job-board-scraper](https://github.com/adgramigna/job-board-scraper) | **54** | 13 | 7 | 6 | 15 | 6 | 5 | 2 | 0 | Reference |
| 38 | [SimplifyJobs/New-Grad-Positions](https://github.com/SimplifyJobs/New-Grad-Positions) | **54** | 11 | 5 | 15 | 0 | 8 | 3 | 8 | 4 | Reference |
| 39 | [plibither8/jobber](https://github.com/plibither8/jobber) | **51** | 13 | 6 | 1 | 15 | 7 | 0 | 9 | 0 | Adapt |
| 40 | [workopia/workopia-mcp](https://github.com/workopia/workopia-mcp) | **51** | 9 | 4 | 12 | 15 | 5 | 0 | 4 | 2 | Reference |
| 41 | [Ztrimus/ResumeFlow](https://github.com/Ztrimus/ResumeFlow) | **51** | 12 | 5 | 9 | 15 | 6 | 0 | 2 | 2 | Reference |
| 42 | [PaulMcInnis/JobFunnel](https://github.com/PaulMcInnis/JobFunnel) | **50** | 11 | 8 | 0 | 15 | 5 | 7 | 1 | 3 | Reference |
| 43 | [rainmanjam/jobspy-api](https://github.com/rainmanjam/jobspy-api) | **50** | 10 | 7 | 3 | 15 | 4 | 7 | 2 | 2 | Avoid |
| 44 | [eliasbiondo/linkedin-mcp-server](https://github.com/eliasbiondo/linkedin-mcp-server) | **49** | 8 | 6 | 12 | 15 | 2 | 3 | 1 | 2 | Avoid |
| 45 | [GodsScion/Auto_job_applier_linkedIn](https://github.com/GodsScion/Auto_job_applier_linkedIn) | **49** | 8 | 5 | 12 | 15 | 1 | 5 | 0 | 3 | Avoid |
| 46 | [lukasz-madon/awesome-remote-job](https://github.com/lukasz-madon/awesome-remote-job) | **49** | 9 | 3 | 12 | 0 | 9 | 3 | 8 | 5 | Reference |
| 47 | [naumov-alex/LinkedIn-AI-Job-Applier-Ultimate](https://github.com/naumov-alex/LinkedIn-AI-Job-Applier-Ultimate) | **49** | 7 | 7 | 12 | 15 | 1 | 6 | 0 | 1 | Avoid |
| 48 | [xitanggg/open-resume](https://github.com/xitanggg/open-resume) | **48** | 13 | 9 | 1 | 4 | 8 | 2 | 7 | 4 | Reference (AGPL) |
| 49 | [Hunterdii/Smart-AI-Resume-Analyzer](https://github.com/Hunterdii/Smart-AI-Resume-Analyzer) | **45** | 9 | 5 | 6 | 15 | 5 | 2 | 1 | 2 | Avoid |
| 50 | [olyaiy/resume-lm](https://github.com/olyaiy/resume-lm) | **44** | 12 | 9 | 0 | 4 | 6 | 7 | 4 | 2 | Reference (AGPL, archived) |
| 51 | [christopherlam888/workday-scraper](https://github.com/christopherlam888/workday-scraper) | **43** | 11 | 5 | 3 | 15 | 5 | 2 | 2 | 0 | Reference |
| 52 | [nicolomantini/LinkedIn-Easy-Apply-Bot](https://github.com/nicolomantini/LinkedIn-Easy-Apply-Bot) | **43** | 6 | 4 | 12 | 15 | 1 | 2 | 0 | 3 | Avoid |
| 53 | [weicanie/prisma-ai](https://github.com/weicanie/prisma-ai) | **42** | 11 | 7 | 6 | 4 | 5 | 5 | 2 | 2 | Reference (AGPL) |
| 54 | [adrianhajdin/job_pilot](https://github.com/adrianhajdin/job_pilot) | **35** | 11 | 6 | 9 | 0 | 5 | 0 | 3 | 1 | Avoid |
| 55 | [OmkarPathak/pyresparser](https://github.com/OmkarPathak/pyresparser) | **34** | 9 | 5 | 1 | 6 | 6 | 4 | 1 | 2 | Avoid |
| 56 | [borgius/jobspy-mcp-server](https://github.com/borgius/jobspy-mcp-server) | **30** | 10 | 5 | 6 | 0 | 3 | 2 | 3 | 1 | Avoid |
| 57 | [Anshul439/job-auto-apply](https://github.com/Anshul439/job-auto-apply) | **28** | 7 | 4 | 12 | 0 | 2 | 0 | 1 | 2 | Avoid |
| 58 | [binoydutt/Resume-Job-Description-Matching](https://github.com/binoydutt/Resume-Job-Description-Matching) | **22** | 8 | 4 | 1 | 0 | 7 | 0 | 1 | 1 | Avoid |
| 59 | [wodsuz/EasyApplyJobsBot](https://github.com/wodsuz/EasyApplyJobsBot) | **21** | 6 | 4 | 6 | 2 | 1 | 0 | 0 | 2 | Avoid |

**Total repositories evaluated in this report: 59.**


## Repository details

### 1. [career-ops-hq/career-ops](https://github.com/career-ops-hq/career-ops) — 88/100

- **Purpose:** Local-first AI job-search agent: scans ATS boards, checks posting liveness, scores fit, tailors CV, drafts answers; human presses Submit
- **GitHub description:** Open-source AI job search agent and job finder: scan job boards, score each job 1-5 against your CV before you apply, tailor an ATS-friendly resume and cover letter, get interview prep and an application tracker. It helps you fill in each application; you press Submit. Runs locally in Codex, OpenCode and other AI CLIs, or as a Claude Code plugin.
- **Stars / forks / open issues+PRs:** 84,950 / 15,545 / 486 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2026-04-04
- **Primary language / detected stack:** JavaScript / Playwright, OpenAI SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Greenhouse/Ashby/Lever/Workday/SuccessFactors scanners, HN, Seek, Himalayas; OpenAI/Gemini/Ollama/OpenRouter evaluators; Playwright PDF
- **Engineering signals:** 4773 files · 2185 test files · 12 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Strong posture: LEGAL_DISCLAIMER, robots-check.mjs, untrusted-content validation, PII workspace, "a human decides" principle
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Liveness checking (liveness-*.mjs), ATS vendor detection (ats-vendor.mjs, discover-ats.mjs), listing fingerprint + repost detection, follow-up cadence, reply matcher, funnel analytics ideas
- **Limitations / reasons not to reuse:** CLI/agent-oriented Node scripts with filesystem state; 280+ top-level scripts make extraction effortful; not a web service; port ideas to Workers rather than copying
- **Decision:** **Reference**

### 2. [reactive-resume/reactive-resume](https://github.com/reactive-resume/reactive-resume) — 86/100

- **Purpose:** Mature open-source resume builder with JSON schema and PDF export
- **GitHub description:** A one-of-a-kind resume builder that keeps your privacy in mind. Completely secure, customizable, portable, open-source and free forever. Try it out today!
- **Stars / forks / open issues+PRs:** 46,123 / 4,972 / 16 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2020-03-25
- **Primary language / detected stack:** TypeScript / React, Playwright, Wrangler, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker, Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Self-hosted; Playwright/Browserless printing; recent wrangler config
- **Engineering signals:** 3622 files · 626 test files · 6 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** SECURITY.md; strong project hygiene; 626 tests
- **Cloudflare Workers compatibility (6/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** JSON Resume-style schema, template rendering approach, PDF export patterns
- **Limitations / reasons not to reuse:** Builder, not job search; heavy app. Use schema ideas only
- **Decision:** **Reference**

### 3. [srbhr/Resume-Matcher](https://github.com/srbhr/Resume-Matcher) — 82/100

- **Purpose:** Resume-to-JD matching and ATS-style keyword/semantic scoring with LLM suggestions
- **GitHub description:** The #1 AI Harness for Building Resumes, PDFs, Cover Letters & more, locally with 100+ LLMs support.
- **Stars / forks / open issues+PRs:** 29,424 / 5,157 / 46 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-16 (10 days before check) · created 2020-04-08
- **Primary language / detected stack:** Python / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Local LLMs (Ollama) or hosted; FastAPI + Next.js
- **Engineering signals:** 790 files · 331 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** Local-first; SECURITY.md; 331 tests
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Keyword extraction + similarity scoring approach, improvement suggestions UX
- **Limitations / reasons not to reuse:** Python backend (FastAPI); scoring must be re-implemented in TypeScript for Workers
- **Decision:** **Adapt**

### 4. [Gsync/jobsync](https://github.com/Gsync/jobsync) — 81/100

- **Purpose:** Next.js job-application tracker with AI resume review and job matching
- **GitHub description:** Job application tracker and AI-powered job search assistant. Helps job seekers manage their search journey with AI resume review, job matching, task logging, and application analytics, all while keeping your data private.
- **Stars / forks / open issues+PRs:** 1,558 / 280 / 37 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-14 (12 days before check) · created 2024-05-21
- **Primary language / detected stack:** TypeScript / Next.js, React, Prisma, Playwright, OpenAI SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Prisma (SQLite/Postgres), OpenAI/Ollama, Playwright
- **Engineering signals:** 1205 files · 366 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Self-hosted; 366 tests; auth via NextAuth
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Application pipeline statuses, activity timeline, interview stages, dashboard metrics design
- **Limitations / reasons not to reuse:** Next.js + Prisma server; port the domain model to D1 rather than reuse code
- **Decision:** **Reference**

### 5. [kalil0321/ats-scrapers](https://github.com/kalil0321/ats-scrapers) — 80/100

- **Purpose:** Python library + dataset covering ~95 ATS and public job sources with typed Job schema
- **GitHub description:** Open job data from ATS platforms and public job sources: free dataset and Python scrapers. By Stapply.
- **Stars / forks / open issues+PRs:** 216 / 55 / 19 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2025-10-28
- **Primary language / detected stack:** Python / Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Greenhouse, Lever, Ashby, SmartRecruiters, Workable, Recruitee, Personio, Teamtailor, Workday, iCIMS, USAJobs, EURES, Bundesagentur, RemoteOK, WWR, YC …
- **Engineering signals:** 400 files · 175 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Mostly public JSON endpoints; BUT includes cloakbrowser stealth module for Tesla/Meta that bypasses bot managers — must be excluded
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Per-ATS endpoint knowledge, Job schema (docs/JOB_SCHEMA.md), ATS discovery rules (docs/DISCOVERY_RULES.md), throttling, company→ATS slug manifest
- **Limitations / reasons not to reuse:** Python; some adapters scrape HTML or evade bot protection. Port only documented public-API adapters to TS with MIT attribution
- **Decision:** **Adapt (public-API adapters only)**

### 6. [ai-job-search-dev/ai-job-search](https://github.com/ai-job-search-dev/ai-job-search) — 79/100

- **Purpose:** Claude Code-based application framework: profile, fit evaluation, drafter-reviewer CV and cover-letter pipeline, interview prep
- **GitHub description:** The job search that runs on your machine. AI job application framework built on Claude Code: evaluate postings, tailor CVs, write cover letters, prep interviews. Fork it and own it.
- **Stars / forks / open issues+PRs:** 73,557 / 23,510 / 44 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2026-03-18
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Community job-portal skills; LLM via Claude Code; Python helpers
- **Engineering signals:** 181 files · 72 test files · 4 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** Local-first; SECURITY.md present; user data stays in repo fork
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Drafter/reviewer prompt pattern for tailoring; structured evaluation rubric
- **Limitations / reasons not to reuse:** Workflow is prompt/skill files for a coding agent, not reusable application code
- **Decision:** **Reference**

### 7. [vaibhavarora14/job-application-agent](https://github.com/vaibhavarora14/job-application-agent) — 78/100

- **Purpose:** Agent skill + CLI for job applications with tracker
- **GitHub description:** JobAppAgent: open-source AI job application agent (Agent Skill + CLI). Searches wide, matches one verified résumé, applies within your rules on Greenhouse, Ashby and Lever, tracks confirmed submissions.
- **Stars / forks / open issues+PRs:** 179 / 30 / 7 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2026-08-12
- **Primary language / detected stack:** JavaScript / Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** ATS boards; Playwright; wrangler config present
- **Engineering signals:** 524 files · 135 test files · 11 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** SECURITY.md; 135 tests
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Application workflow states; CLI ergonomics
- **Limitations / reasons not to reuse:** Young project; agent-centric
- **Decision:** **Reference**

### 8. [ever-co/ever-jobs](https://github.com/ever-co/ever-jobs) — 77/100

- **Purpose:** Large TypeScript monorepo aggregating jobs/gigs from many sources
- **GitHub description:** Ever® Jobs™ - aggregating jobs/gigs postings from multiple sources - https://hust.so/oss
- **Stars / forks / open issues+PRs:** 142 / 40 / 8 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2026-02-08
- **Primary language / detected stack:** TypeScript / Next.js, Prisma, Drizzle, Playwright, OpenAI SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Postgres, SQLite, Redis; deploy: Docker
- **Data sources & integrations:** Many job sources; Prisma/Drizzle; Next.js
- **Engineering signals:** 20739 files · 4152 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** SECURITY.md; 4k test files
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Source plugin architecture in TypeScript
- **Limitations / reasons not to reuse:** Very heavy monorepo (20k files); includes scraping sources with unclear ToS
- **Decision:** **Reference**

### 9. [sunnypatell/ats-screener](https://github.com/sunnypatell/ats-screener) — 77/100

- **Purpose:** Client-side resume screener simulating enterprise ATS parsers
- **GitHub description:** free, open-source resume screener that simulates how 6 real enterprise ATS platforms (Workday, Taleo, iCIMS, Greenhouse, Lever, SuccessFactors) parse, filter, and score your resume. built by a student tired of paywalled resume checkers.
- **Stars / forks / open issues+PRs:** 204 / 33 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-02 (24 days before check) · created 2026-02-20
- **Primary language / detected stack:** Svelte / Svelte, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Browser-side parsing
- **Engineering signals:** 280 files · 48 test files · 1 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** SECURITY.md; client-side privacy
- **Cloudflare Workers compatibility (6/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** ATS parse-ability checks list
- **Limitations / reasons not to reuse:** Svelte; heuristic simulation
- **Decision:** **Reference**

### 10. [remoteintech/remote-jobs](https://github.com/remoteintech/remote-jobs) — 76/100

- **Purpose:** Community directory of remote-friendly companies (now Eleventy site)
- **GitHub description:** Source for remoteintech.company — a community-maintained directory of remote-friendly tech companies
- **Stars / forks / open issues+PRs:** 41,217 / 3,978 / 14 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-14 (12 days before check) · created 2015-10-13
- **Primary language / detected stack:** JavaScript / —
- **Licence:** ISC (+MIT, OFL) — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Curated company profiles
- **Engineering signals:** 1124 files · 3 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** ISC/MIT content; no personal data
- **Cloudflare Workers compatibility (7/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Company list for seeding career-page discovery
- **Limitations / reasons not to reuse:** Company directory, not job listings; needs ATS resolution
- **Decision:** **Reuse (data, with attribution)**

### 11. [vesaias/JobNavigator](https://github.com/vesaias/JobNavigator) — 74/100

- **Purpose:** Self-hosted multi-account job-hunt automation: career pages, tracking
- **GitHub description:** Self-hosted, multi-account job-hunt automation: scrape career pages and job boards, score jobs against your résumés with AI, tailor résumés and cover letters, auto-fill applications, track every application, get Telegram alerts. Chrome extension, five themes, in your Docker. 
- **Stars / forks / open issues+PRs:** 198 / 66 / 7 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-23 (3 days before check) · created 2026-04-15
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Career pages; Playwright
- **Engineering signals:** 641 files · 355 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** 355 tests; SECURITY.md
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Career-page monitoring model
- **Limitations / reasons not to reuse:** Python; multi-account automation risks
- **Decision:** **Reference**

### 12. [cncf/gitjobs](https://github.com/cncf/gitjobs) — 72/100

- **Purpose:** CNCF open-source developer job board (Rust)
- **GitHub description:** GitJobs is a simple open source, developer first job board focused on open source job opportunities.
- **Stars / forks / open issues+PRs:** 127 / 25 / 13 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-09 (17 days before check) · created 2025-01-13
- **Primary language / detected stack:** Rust / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Own postings; Postgres
- **Engineering signals:** 539 files · 116 test files · 4 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** 116 tests; dependabot
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Job posting schema, moderation flow
- **Limitations / reasons not to reuse:** Rust + Postgres; different product
- **Decision:** **Reference**

### 13. [craftled/bordful](https://github.com/craftled/bordful) — 72/100

- **Purpose:** Next.js + Payload job board template
- **GitHub description:** Open-source Next.js and Payload job board. Live in about two minutes with sample jobs from Bordfeed.
- **Stars / forks / open issues+PRs:** 75 / 39 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2024-12-10
- **Primary language / detected stack:** TypeScript / Next.js, React, Playwright
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Postgres; deploy: library / local
- **Data sources & integrations:** Own postings; Postgres
- **Engineering signals:** 655 files · 199 test files · 1 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** 199 tests; SECURITY.md
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** SEO job-page templates, JSON-LD JobPosting markup
- **Limitations / reasons not to reuse:** Job board, not aggregator
- **Decision:** **Reference**

### 14. [feder-cr/Jobs_Applier_AI_Agent](https://github.com/feder-cr/Jobs_Applier_AI_Agent) — 71/100

- **Purpose:** AIHawk: LLM resume/cover-letter generation and (historically) LinkedIn auto-apply
- **GitHub description:** AIHawk: AI job application bot, automated job search, job hunting, auto-apply to resume-matching jobs while you sleep.
- **Stars / forks / open issues+PRs:** 32,650 / 4,776 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2024-08-04
- **Primary language / detected stack:** Python / Playwright, OpenAI SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** OpenAI-compatible LLMs; Playwright; YAML profile
- **Engineering signals:** 94 files · 20 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** Automated submission to LinkedIn conflicts with LinkedIn User Agreement; project scope has narrowed over time after takedown pressure
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Resume-generation prompt structure; YAML profile schema ideas
- **Limitations / reasons not to reuse:** Python desktop bot; auto-apply design is exactly what JobFlow must not do; not CF-compatible
- **Decision:** **Reference**

### 15. [amikai/openings-mcp](https://github.com/amikai/openings-mcp) — 70/100

- **Purpose:** MCP server searching job boards and company career sites
- **GitHub description:** 💼 One MCP server to search job boards and company career sites
- **Stars / forks / open issues+PRs:** 109 / 12 / 18 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-26 (31 days before check) · created 2026-06-27
- **Primary language / detected stack:** Go / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Job boards + ATS; Go
- **Engineering signals:** 1772 files · 156 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** 156 tests
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** MCP tool design for job search (future JobFlow MCP endpoint)
- **Limitations / reasons not to reuse:** Go; not Workers runtime
- **Decision:** **Reference**

### 16. [averatec0773/offeros](https://github.com/averatec0773/offeros) — 70/100

- **Purpose:** Local-first application agent that tracks every application after submit (Gmail reply tracking)
- **GitHub description:** Local-first AI job-application agent: it tracks every application after you apply, explains failures with per-field evidence, and answers questions about your search — while its Chrome side panel fills real ATS forms (Greenhouse, Lever, Ashby, iCIMS, Workday). Your data and API key never leave your machine.
- **Stars / forks / open issues+PRs:** 46 / 7 / 5 (checked 2026-11-26)
- **Last commit on default branch:** 2026-08-13 (105 days before check) · created 2026-07-26
- **Primary language / detected stack:** TypeScript / —
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** SQLite; deploy: library / local
- **Data sources & integrations:** Gmail, ATS; SQLite
- **Engineering signals:** 629 files · 238 test files · 1 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** SECURITY.md; 238 tests
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Post-application tracking & reply-state machine
- **Limitations / reasons not to reuse:** Young; Apache-2.0 so adaptable if needed
- **Decision:** **Reference**

### 17. [lastsunday/job-hunting](https://github.com/lastsunday/job-hunting) — 70/100

- **Purpose:** Browser extension aggregating info while job hunting (China-focused)
- **GitHub description:** 职位猎人 - 协助找工作的工具
- **Stars / forks / open issues+PRs:** 462 / 45 / 25 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-09 (48 days before check) · created 2024-05-29
- **Primary language / detected stack:** JavaScript / Next.js, React, Playwright, Puppeteer
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Boss/Liepin etc. via extension
- **Engineering signals:** 1153 files · 71 test files · 11 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** SECURITY.md
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Browser-extension architecture for user-authorised page capture
- **Limitations / reasons not to reuse:** Region-specific sites
- **Decision:** **Reference**

### 18. [LingyiChen-AI/JadeAI](https://github.com/LingyiChen-AI/JadeAI) — 70/100

- **Purpose:** AI resume builder with 50+ templates, PDF export
- **GitHub description:** AI-Powered Smart Resume Builder — 50+ professional templates, PDF/image parsing, AI optimization, JD match analysis, multi-format export. Open source & free, one-click Docker deployment.
- **Stars / forks / open issues+PRs:** 2,023 / 226 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-23 (34 days before check) · created 2026-02-10
- **Primary language / detected stack:** TypeScript / Next.js, React, Drizzle, Puppeteer, OpenAI SDK, Anthropic SDK, PDF libs
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** Postgres, SQLite; deploy: Docker
- **Data sources & integrations:** Drizzle, SQLite/Postgres, OpenAI/Anthropic, Puppeteer
- **Engineering signals:** 670 files · 44 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** 44 tests
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Resume template system; Drizzle schema
- **Limitations / reasons not to reuse:** Builder-focused; Puppeteer PDF not Workers-native
- **Decision:** **Reference**

### 19. [tarunlnmiit/autopilot-jobhunt](https://github.com/tarunlnmiit/autopilot-jobhunt) — 69/100

- **Purpose:** Scans 130+ careers pages nightly and scores roles against profile
- **GitHub description:** AI job agent: scans 130+ careers pages nightly, scores every role against your resume with an LLM (0–100), alerts you on Telegram, and drafts tailored cover letters + resumes. Free & open source.
- **Stars / forks / open issues+PRs:** 219 / 54 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-15 (72 days before check) · created 2026-06-06
- **Primary language / detected stack:** Python / OpenAI SDK, Anthropic SDK
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Career pages/ATS; OpenAI/Anthropic
- **Engineering signals:** 74 files · 10 test files · 1 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: yes
- **Security & privacy:** SECURITY.md
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Nightly scan + scoring loop pattern
- **Limitations / reasons not to reuse:** Python
- **Decision:** **Reference**

### 20. [suxrobGM/jobpilot](https://github.com/suxrobGM/jobpilot) — 68/100

- **Purpose:** AI agent that finds openings, tailors resume and applies
- **GitHub description:** An AI agent that applies to jobs for you. It finds openings, tailors your resume, and fills out applications in a real browser on your own machine. Runs on your Claude Code or Codex subscription.
- **Stars / forks / open issues+PRs:** 114 / 30 / 24 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-09 (17 days before check) · created 2026-03-22
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Job boards; browser automation
- **Engineering signals:** 1358 files · 128 test files · 4 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Auto-apply component
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Tailoring flow
- **Limitations / reasons not to reuse:** Auto-apply conflicts with approval rule
- **Decision:** **Reference**

### 21. [DaKheera47/job-ops](https://github.com/DaKheera47/job-ops) — 67/100

- **Purpose:** Self-hosted job pipeline: discovery, AI scoring, tailored resumes, tracker, Gmail-based reply tracking
- **GitHub description:** job-ops: DevOps principles applied to job hunting. A self-hosted pipeline to track, analyze, and assist your application process
- **Stars / forks / open issues+PRs:** 4,215 / 573 / 71 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2025-12-11
- **Primary language / detected stack:** TypeScript / —
- **Licence:** Commons Clause (no selling) — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Multiple job sources, LLM providers, Gmail; Docker deploy
- **Engineering signals:** 2273 files · 322 test files · 4 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Self-hosted; 322 test files and CI; Commons Clause forbids selling
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Pipeline state model, UI flows for review queues, Gmail reply classification ideas
- **Limitations / reasons not to reuse:** LICENSE is Commons Clause: cannot be incorporated into a commercial/SaaS product. Study only
- **Decision:** **Reference (licence)**

### 22. [matthewprice/JobFinderOS](https://github.com/matthewprice/JobFinderOS) — 66/100

- **Purpose:** Claude Code agents polling Greenhouse/Ashby/Lever and scoring roles
- **GitHub description:** Open-source AI job search agents for Claude Code. Polls Greenhouse, Ashby and Lever job boards directly, scores roles against your profile, preps interviews, drafts outreach, and writes it all to an Obsidian vault. A recruiter, a crawler and a market analyst, benchmarked against plain LLM crawling.
- **Stars / forks / open issues+PRs:** 192 / 36 / 5 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-31 (26 days before check) · created 2026-09-06
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** ATS APIs; Claude
- **Engineering signals:** 144 files · 22 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Local
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Agent prompt designs
- **Limitations / reasons not to reuse:** Agent-skill project; no CI
- **Decision:** **Reference**

### 23. [Riley-Dorrington/job-board-aggregator](https://github.com/Riley-Dorrington/job-board-aggregator) — 66/100

- **Purpose:** Aggregator indexing ~1M jobs from ~20k companies via ATS APIs
- **GitHub description:** Job board aggregator indexing 1,000,000+ active positions from 20,000+ companies across Greenhouse, Lever, Ashby, Workday, and other major ATS platforms. Multithreaded Python ETL pipeline, daily automated refreshes via GitHub Actions, filterable client-side search.
- **Stars / forks / open issues+PRs:** 188 / 41 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-25 (1 days before check) · created 2026-01-05
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Greenhouse/Lever/Ashby/Workday etc.
- **Engineering signals:** 75 files · 6 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Public ATS endpoints
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Company list seeding strategy; incremental refresh ideas
- **Limitations / reasons not to reuse:** Python, 6 tests; scale claims unverified
- **Decision:** **Reference**

### 24. [speedyapply/JobSpy](https://github.com/speedyapply/JobSpy) — 65/100

- **Purpose:** Python library scraping LinkedIn, Indeed, Glassdoor, Google, ZipRecruiter, Naukri, Bayt, Seek
- **GitHub description:** Jobs scraper library for LinkedIn, Indeed, ZipRecruiter, Glassdoor, SEEK, Naukri, HelloWork, Bayt & BDJobs
- **Stars / forks / open issues+PRs:** 4,835 / 963 / 39 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-20 (6 days before check) · created 2023-07-06
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Scrapes LinkedIn guest endpoint /jobs-guest/jobs/api/seeMoreJobPostings with randomised delays; Indeed/Glassdoor internal GraphQL
- **Engineering signals:** 52 files · 0 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** LinkedIn and Glassdoor paths use unofficial endpoints and proxy rotation: ToS risk; no tests in tree
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Unified Job model/schema; salary normalisation (hourly/annual); site adapter interface
- **Limitations / reasons not to reuse:** Most sources are unofficial scraping; zero test files; Python only. Use as schema reference, never for LinkedIn
- **Decision:** **Adapt (non-LinkedIn only)**

### 25. [alpharomercoma/ts-jobspy](https://github.com/alpharomercoma/ts-jobspy) — 63/100

- **Purpose:** TypeScript port of JobSpy
- **GitHub description:** TypeScript job scraper for LinkedIn, Indeed, Glassdoor, ZipRecruiter & more - rewritten from python-jobspy
- **Stars / forks / open issues+PRs:** 18 / 3 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-17 (70 days before check) · created 2025-08-23
- **Primary language / detected stack:** TypeScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Same as JobSpy
- **Engineering signals:** 79 files · 32 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** LinkedIn/Glassdoor unofficial endpoints
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Typed TS Job model
- **Limitations / reasons not to reuse:** Same compliance problems as JobSpy
- **Decision:** **Reference**

### 26. [emredurukn/awesome-job-boards](https://github.com/emredurukn/awesome-job-boards) — 63/100

- **Purpose:** Curated list of job boards worldwide
- **GitHub description:** A curated list of awesome job boards
- **Stars / forks / open issues+PRs:** 1,123 / 389 / 25 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-24 (2 days before check) · created 2019-05-21
- **Primary language / detected stack:** — / —
- **Licence:** CC0-1.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Links
- **Engineering signals:** 7 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** CC0
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Global source discovery inventory
- **Limitations / reasons not to reuse:** Not code
- **Decision:** **Reuse (data)**

### 27. [BjornMelin/ai-job-scraper](https://github.com/BjornMelin/ai-job-scraper) — 61/100

- **Purpose:** Privacy-focused local AI job scraper with Streamlit dashboard
- **GitHub description:** 🕵️‍♂️ Privacy-focused AI job scraper, local storage, and interactive dashboard. Auto-scrapes AI/ML roles from top companies using ScrapeGraph-AI + LLM and LangGraph Agents, filters for relevance, and provides a Streamlit UI for tracking applications. Built for developers seeking AI careers.
- **Stars / forks / open issues+PRs:** 50 / 19 / 10 (checked 2026-11-26)
- **Last commit on default branch:** 2026-07-14 (135 days before check) · created 2025-07-29
- **Primary language / detected stack:** Python / Streamlit
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Career pages; local LLM
- **Engineering signals:** 106 files · 33 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** Local storage
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Local-first privacy model
- **Limitations / reasons not to reuse:** Python/Streamlit
- **Decision:** **Reference**

### 28. [gubidonius/ats-job-boards-reference](https://github.com/gubidonius/ats-job-boards-reference) — 61/100

- **Purpose:** Documentation of public Greenhouse/Lever/Ashby/SmartRecruiters board APIs
- **GitHub description:** What the Greenhouse, Lever, Ashby and SmartRecruiters public job board APIs actually return. Field coverage measured on 5,117 live adverts, eight traps that cost real time, and a dated snapshot you can read without signing up.
- **Stars / forks / open issues+PRs:** 6 / 1 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-01 (86 days before check) · created 2026-08-29
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Public ATS APIs
- **Engineering signals:** 10 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Docs only
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Endpoint reference for adapters
- **Limitations / reasons not to reuse:** Small; verify against vendor docs
- **Decision:** **Reference**

### 29. [jananthan30/Resume-Builder](https://github.com/jananthan30/Resume-Builder) — 61/100

- **Purpose:** AI resume & cover letter generator with ATS + HR scoring
- **GitHub description:** AI-powered resume & cover letter generator with dual ATS + HR scoring. Works for any profession. Claude Code plugin.
- **Stars / forks / open issues+PRs:** 96 / 34 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-08-15 (103 days before check) · created 2026-03-01
- **Primary language / detected stack:** Python / FastAPI, Anthropic SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Anthropic; FastAPI
- **Engineering signals:** 209 files · 21 test files · 3 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** SECURITY.md
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Dual ATS/HR scoring rubric
- **Limitations / reasons not to reuse:** Python
- **Decision:** **Reference**

### 30. [fedorchenko-juli/job_search_tool](https://github.com/fedorchenko-juli/job_search_tool) — 60/100

- **Purpose:** Pipeline fetching roles from company ATS APIs and scoring them with Claude
- **GitHub description:** Automated job search pipeline: fetches roles from company ATS APIs and aggregators, filters and dedupes them, optionally scores fit with Claude, and reviews results in a local web board.
- **Stars / forks / open issues+PRs:** 156 / 85 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-19 (68 days before check) · created 2026-09-19
- **Primary language / detected stack:** Python / Anthropic SDK
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** ATS APIs; Anthropic API
- **Engineering signals:** 55 files · 6 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Small codebase
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** LLM scoring prompt + filter pipeline
- **Limitations / reasons not to reuse:** No CI; small project
- **Decision:** **Reference**

### 31. [rishilahoti/ashby-job-scraper](https://github.com/rishilahoti/ashby-job-scraper) — 59/100

- **Purpose:** Free job board pulling 70k+ jobs from 2k+ companies via Ashby/Greenhouse/Lever
- **GitHub description:** Free job board that pulls 70,000+ open jobs from 2,000+ companies straight from their own career pages on Ashby, Greenhouse, Lever, Workday, SmartRecruiters, Workable, Recruitee, Teamtailor and Pinpoint. Updated daily, ranked by relevance, filter by role, tech stack, location and remote.
- **Stars / forks / open issues+PRs:** 71 / 17 / 10 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2026-02-28
- **Primary language / detected stack:** JavaScript / Nodemailer
- **Licence:** MIT + Commons Clause — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Public ATS APIs
- **Engineering signals:** 193 files · 17 test files · 6 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: yes · dependency bot: yes
- **Security & privacy:** MIT + Commons Clause: no selling
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Company slug lists; UI ideas
- **Limitations / reasons not to reuse:** Commons Clause prevents commercial reuse
- **Decision:** **Reference (licence)**

### 32. [spinlud/py-linkedin-jobs-scraper](https://github.com/spinlud/py-linkedin-jobs-scraper) — 59/100

- **Purpose:** Selenium-based LinkedIn jobs scraper library
- **GitHub description:** —
- **Stars / forks / open issues+PRs:** 495 / 127 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2020-09-28
- **Primary language / detected stack:** Python / Selenium
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** LinkedIn pages
- **Engineering signals:** 120 files · 52 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: yes
- **Security & privacy:** Scraping LinkedIn violates User Agreement
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Non-compliant
- **Decision:** **Avoid**

### 33. [DanielPan12/JobHuntBot](https://github.com/DanielPan12/JobHuntBot) — 58/100

- **Purpose:** Agent-led application workflow with local dashboard
- **GitHub description:** Agent-led job application workflow with a local progress-tracking dashboard — works with any AI coding agent that can read files and follow instructions.AI Agent 驱动的求职投递工作流,配本地进度追踪看板——适配任何能读文件、听懂指令的编程 Agent。
- **Stars / forks / open issues+PRs:** 894 / 72 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-12 (45 days before check) · created 2026-08-02
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Local
- **Engineering signals:** 51 files · 9 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** 9 tests
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Dashboard ideas
- **Limitations / reasons not to reuse:** Small
- **Decision:** **Reference**

### 34. [Francis1998/agentic-career-search](https://github.com/Francis1998/agentic-career-search) — 58/100

- **Purpose:** Agentic discovery backend with 119 ATS & job-board adapters
- **GitHub description:** Agentic job-discovery backend: 119 ATS & job-board adapters (Greenhouse, Lever, Workday, JSON-LD), explainable scoring with decision traces, cancellable runs, JobSpy-style search with symbol-aware dedupe, CSV/JSONL export, Atom feeds, resume-to-job matching, a read-only MCP server and optional GPT-6.2, Claude 5.5, Gemini 4 or Kimi K3.1 enrichment.
- **Stars / forks / open issues+PRs:** 102 / 17 / 7 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-21 (5 days before check) · created 2026-06-21
- **Primary language / detected stack:** Python / FastAPI
- **Licence:** NONE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** ATS + boards; FastAPI; SQLite
- **Engineering signals:** 1452 files · 331 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** No licence file: all rights reserved by default
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Adapter catalogue as research input
- **Limitations / reasons not to reuse:** No licence = cannot reuse code
- **Decision:** **Reference (no licence)**

### 35. [espin086/GPT-Jobhunter](https://github.com/espin086/GPT-Jobhunter) — 56/100

- **Purpose:** AI job search with resume-match scoring (FastAPI/Streamlit)
- **GitHub description:** GPT Job Hunter uses AI to solve the biggest problem in job hunting: getting past ATS systems. Upload your resume once, and our AI finds jobs that match your skills, scores each opportunity 0-100%, and—here's the game-changer—automatically rewrites your entire resume tailored to the specific jobs you're targeting.    No more generic applications. 
- **Stars / forks / open issues+PRs:** 97 / 21 / 3 (checked 2026-11-26)
- **Last commit on default branch:** 2026-07-21 (128 days before check) · created 2022-11-16
- **Primary language / detected stack:** Python / FastAPI, Streamlit, OpenAI SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Job APIs; OpenAI
- **Engineering signals:** 22349 files · 16 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Repo has 22k files (data committed)
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Match scoring idea
- **Limitations / reasons not to reuse:** Bloated repo
- **Decision:** **Reference**

### 36. [Paramchoudhary/ResumeSkills](https://github.com/Paramchoudhary/ResumeSkills) — 55/100

- **Purpose:** Collection of AI agent skills for resume optimisation
- **GitHub description:** A collection of AI agent skills focused on resume optimization, job applications, and career development. Built for job seekers, career changers, and professionals who want Claude Code to help with resume writing, ATS optimization, interview prep, and strategic job search.
- **Stars / forks / open issues+PRs:** 3,352 / 269 / 8 (checked 2026-11-26)
- **Last commit on default branch:** 2026-06-19 (160 days before check) · created 2026-01-30
- **Primary language / detected stack:** — / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Prompts
- **Engineering signals:** 83 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** Prompts only
- **Cloudflare Workers compatibility (5/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Prompt ideas
- **Limitations / reasons not to reuse:** Not application code
- **Decision:** **Reference**

### 37. [adgramigna/job-board-scraper](https://github.com/adgramigna/job-board-scraper) — 54/100

- **Purpose:** Scrapes Greenhouse, Lever, Ashby, Rippling boards into Postgres
- **GitHub description:** Scrapes job listings from popular job boards Greenhouse, Lever, Ashby, and Rippling
- **Stars / forks / open issues+PRs:** 47 / 6 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2025-11-26 (365 days before check) · created 2023-01-24
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** Postgres; deploy: library / local
- **Data sources & integrations:** ATS endpoints; dbt/Postgres
- **Engineering signals:** 81 files · 4 test files · 3 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Small
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** ATS endpoint + normalisation examples; data-engineering pipeline example
- **Limitations / reasons not to reuse:** Python + Postgres; 4 tests
- **Decision:** **Reference**

### 38. [SimplifyJobs/New-Grad-Positions](https://github.com/SimplifyJobs/New-Grad-Positions) — 54/100

- **Purpose:** Community-maintained list of new-grad tech roles
- **GitHub description:** A collection of full time roles in SWE, Quant, and PM for new grads.
- **Stars / forks / open issues+PRs:** 18,412 / 1,320 / 44 (checked 2026-11-26)
- **Last commit on default branch:** 2026-11-26 (0 days before check) · created 2021-06-08
- **Primary language / detected stack:** — / —
- **Licence:** NONE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Curated postings (README)
- **Engineering signals:** 21 files · 0 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** No licence file
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Data source idea (respect licence)
- **Limitations / reasons not to reuse:** Not code; no licence
- **Decision:** **Reference**

### 39. [plibither8/jobber](https://github.com/plibither8/jobber) — 51/100

- **Purpose:** Minimal Cloudflare Worker API fetching jobs from Ashby, BambooHR, Greenhouse, Lever, Workable
- **GitHub description:** 💼 Super simple API to fetch job listings from popular job boards (Ashby, Greenhouse, Lever, etc.)
- **Stars / forks / open issues+PRs:** 33 / 6 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2022-10-09 (1509 days before check) · created 2022-10-02
- **Primary language / detected stack:** TypeScript / Hono, Wrangler
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Cloudflare Workers (wrangler config)
- **Data sources & integrations:** Public ATS JSON endpoints
- **Engineering signals:** 15 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Tiny surface; no secrets
- **Cloudflare Workers compatibility (9/10):** native / already targets Workers
- **Worth reusing:** Worker-native ATS fetchers (src/boards/*.ts) — closest shape to JobFlow adapters
- **Limitations / reasons not to reuse:** Unmaintained since 2022; no tests; minimal fields (title/location/link). Rewrite with richer schema, keep MIT attribution
- **Decision:** **Adapt**

### 40. [workopia/workopia-mcp](https://github.com/workopia/workopia-mcp) — 51/100

- **Purpose:** MCP client for a hosted job-search/resume service
- **GitHub description:** Workopia MCP Server — free job search, resume builder & career advice for Claude, ChatGPT, Cursor.
- **Stars / forks / open issues+PRs:** 313 / 21 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2026-08-31 (87 days before check) · created 2026-04-14
- **Primary language / detected stack:** JavaScript / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Workopia hosted API
- **Engineering signals:** 16 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Sends data to third-party service
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** MCP tool naming
- **Limitations / reasons not to reuse:** Thin client to proprietary backend
- **Decision:** **Reference**

### 41. [Ztrimus/ResumeFlow](https://github.com/Ztrimus/ResumeFlow) — 51/100

- **Purpose:** LLM pipeline tailoring resume to a JD (Streamlit)
- **GitHub description:** Simplify and improve the job hunting experience by integrating LLMs to automate tasks such as resume and cover letter generation, as well as application submission, saving users time and effort.
- **Stars / forks / open issues+PRs:** 230 / 85 / 26 (checked 2026-11-26)
- **Last commit on default branch:** 2026-06-04 (175 days before check) · created 2023-10-31
- **Primary language / detected stack:** Python / Streamlit, LangChain, OpenAI SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** OpenAI/Gemini via LangChain
- **Engineering signals:** 38 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Small
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Tailoring prompt chain
- **Limitations / reasons not to reuse:** No tests; Streamlit demo quality
- **Decision:** **Reference**

### 42. [PaulMcInnis/JobFunnel](https://github.com/PaulMcInnis/JobFunnel) — 50/100 — **ARCHIVED**

- **Purpose:** Scrape job sites into a de-duplicated spreadsheet
- **GitHub description:** Scrape job websites into a single spreadsheet with no duplicates.
- **Stars / forks / open issues+PRs:** 2,201 / 263 / 10 (checked 2026-11-26)
- **Last commit on default branch:** 2025-12-09 (352 days before check) · created 2017-08-25
- **Primary language / detected stack:** Python / Selenium
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Indeed, Monster (scraping); Selenium
- **Engineering signals:** 79 files · 21 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Archived; scraping-based
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** De-duplication by job ID + content hash concept
- **Limitations / reasons not to reuse:** Archived (read-only); scraping; Python
- **Decision:** **Reference**

### 43. [rainmanjam/jobspy-api](https://github.com/rainmanjam/jobspy-api) — 50/100

- **Purpose:** Dockerised FastAPI around JobSpy with API keys and rate limits
- **GitHub description:** Dockerized version of JobSpy job search utility with API key auth, rate limiting, and proxy support.
- **Stars / forks / open issues+PRs:** 384 / 31 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2025-05-28 (547 days before check) · created 2025-04-28
- **Primary language / detected stack:** Python / FastAPI
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** JobSpy sources
- **Engineering signals:** 84 files · 4 test files · 2 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** Inherits LinkedIn scraping
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** API-key + rate-limit middleware idea only
- **Limitations / reasons not to reuse:** Wrapper; inherits ToS issues
- **Decision:** **Avoid**

### 44. [eliasbiondo/linkedin-mcp-server](https://github.com/eliasbiondo/linkedin-mcp-server) — 49/100

- **Purpose:** MCP server driving LinkedIn people/job search
- **GitHub description:** 🔗 A Model Context Protocol (MCP) server for LinkedIn — search people, companies, and jobs, scrape profiles, and get structured data via any MCP-compatible AI client.
- **Stars / forks / open issues+PRs:** 222 / 41 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-24 (33 days before check) · created 2026-03-07
- **Primary language / detected stack:** Python / —
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** LinkedIn via logged-in session automation
- **Engineering signals:** 58 files · 3 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: yes · dependency bot: no
- **Security & privacy:** Automates a user's LinkedIn session — ToS violation & account risk
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Non-compliant access pattern
- **Decision:** **Avoid**

### 45. [GodsScion/Auto_job_applier_linkedIn](https://github.com/GodsScion/Auto_job_applier_linkedIn) — 49/100

- **Purpose:** Selenium bot that auto-applies to LinkedIn Easy Apply jobs
- **GitHub description:** Make your job hunt easy by automating your application process with this Auto Applier
- **Stars / forks / open issues+PRs:** 3,060 / 841 / 78 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-10 (77 days before check) · created 2023-06-17
- **Primary language / detected stack:** Python / Flask, Selenium, undetected-chromedriver, LangChain, OpenAI SDK
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** LinkedIn UI via undetected-chromedriver; OpenAI
- **Engineering signals:** 64 files · 18 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** Uses undetected-chromedriver (bot-detection evasion) and automated submission — violates LinkedIn terms, account-ban risk
- **Cloudflare Workers compatibility (0/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Detection evasion + auto-submit; incompatible with JobFlow's compliance rules
- **Decision:** **Avoid**

### 46. [lukasz-madon/awesome-remote-job](https://github.com/lukasz-madon/awesome-remote-job) — 49/100

- **Purpose:** Curated list of remote job boards & companies
- **GitHub description:** A curated list of awesome remote jobs and resources. Inspired by https://github.com/vinta/awesome-python
- **Stars / forks / open issues+PRs:** 51,167 / 5,012 / 199 (checked 2026-11-26)
- **Last commit on default branch:** 2026-09-21 (66 days before check) · created 2015-01-02
- **Primary language / detected stack:** — / —
- **Licence:** NONE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Links only
- **Engineering signals:** 10 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** No licence file
- **Cloudflare Workers compatibility (8/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Source discovery list
- **Limitations / reasons not to reuse:** Not code; no licence
- **Decision:** **Reference**

### 47. [naumov-alex/LinkedIn-AI-Job-Applier-Ultimate](https://github.com/naumov-alex/LinkedIn-AI-Job-Applier-Ultimate) — 49/100

- **Purpose:** Playwright LinkedIn/Indeed auto-apply bot with LLM answers
- **GitHub description:** AI-powered LinkedIn and Indeed job bot with Playwright automation, LLM integration, data anonymization, and Telegram reporting. Helps to find relevant vacancies on LinkedIn and Indeed, generates custom resumes and provides vacancies skill statistics.
- **Stars / forks / open issues+PRs:** 187 / 50 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-23 (34 days before check) · created 2025-10-14
- **Primary language / detected stack:** Python / FastAPI, Playwright, LangChain, OpenAI SDK, Anthropic SDK, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** LinkedIn/Indeed UI
- **Engineering signals:** 123 files · 29 test files · 0 CI workflows · SECURITY.md: yes · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Automated submission + LinkedIn automation
- **Cloudflare Workers compatibility (0/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Non-compliant
- **Decision:** **Avoid**

### 48. [xitanggg/open-resume](https://github.com/xitanggg/open-resume) — 48/100

- **Purpose:** Resume builder and client-side PDF resume parser
- **GitHub description:** OpenResume is a powerful open-source resume builder and resume parser. https://open-resume.com/
- **Stars / forks / open issues+PRs:** 8,997 / 1,047 / 149 (checked 2026-11-26)
- **Last commit on default branch:** 2024-10-29 (758 days before check) · created 2023-06-24
- **Primary language / detected stack:** TypeScript / Next.js, React, PDF libs
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** pdf.js in browser
- **Engineering signals:** 160 files · 3 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** Client-side parsing (privacy-friendly)
- **Cloudflare Workers compatibility (7/10):** adaptable (port logic to Web-standard TS)
- **Worth reusing:** Heuristic resume section/feature-scoring parser algorithm (documented)
- **Limitations / reasons not to reuse:** AGPL-3.0 — copying code would force AGPL on JobFlow; last commit Oct 2024; 3 tests
- **Decision:** **Reference (AGPL)**

### 49. [Hunterdii/Smart-AI-Resume-Analyzer](https://github.com/Hunterdii/Smart-AI-Resume-Analyzer) — 45/100

- **Purpose:** Streamlit resume analyzer with Selenium scraping
- **GitHub description:** 📄 Smart Resume AI is a powerful tool designed to revolutionize your job application process. With features like 📚 professional template building, 🔍 ATS-friendly analysis, and 🎯 AI-driven optimization, it ensures your resume stands out to recruiters. Smart Resume AI provides everything you need to craft a tailored, eye-catching resume. 🚀
- **Stars / forks / open issues+PRs:** 262 / 89 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-04-18 (222 days before check) · created 2025-01-08
- **Primary language / detected stack:** C / Streamlit, Selenium, PDF libs
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** Local NLP + scraping
- **Engineering signals:** 526 files · 0 test files · 0 CI workflows · SECURITY.md: yes · CONTRIBUTING: yes · lockfile: no · dependency bot: no
- **Security & privacy:** No tests
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Low code quality signals
- **Decision:** **Avoid**

### 50. [olyaiy/resume-lm](https://github.com/olyaiy/resume-lm) — 44/100 — **ARCHIVED**

- **Purpose:** AI resume builder (Next.js 15, Supabase)
- **GitHub description:** Open-source AI resume builder • Next.js 15, React 19, Tailwind CSS • Tailor job-ready resumes in minutes.
- **Stars / forks / open issues+PRs:** 331 / 127 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-13 (44 days before check) · created 2024-08-01
- **Primary language / detected stack:** TypeScript / Next.js, React, OpenAI SDK, Anthropic SDK, Supabase, PDF libs
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** Redis, Supabase; deploy: Docker
- **Data sources & integrations:** Supabase, OpenAI/Anthropic
- **Engineering signals:** 428 files · 23 test files · 2 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** AGPL-3.0; archived
- **Cloudflare Workers compatibility (4/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Tailoring UX patterns
- **Limitations / reasons not to reuse:** Archived; AGPL; Supabase
- **Decision:** **Reference (AGPL, archived)**

### 51. [christopherlam888/workday-scraper](https://github.com/christopherlam888/workday-scraper) — 43/100

- **Purpose:** Selenium scraper for Workday career sites
- **GitHub description:** A web scraper to get the latest job postings from Workday sites.
- **Stars / forks / open issues+PRs:** 17 / 3 / 1 (checked 2026-11-26)
- **Last commit on default branch:** 2025-09-07 (445 days before check) · created 2024-06-11
- **Primary language / detected stack:** Python / Selenium
- **Licence:** MIT — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Workday tenant pages
- **Engineering signals:** 19 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Scraping via Selenium
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Workday URL structure knowledge
- **Limitations / reasons not to reuse:** No tests; Selenium; prefer Workday's public JSON (cxs) endpoint documented elsewhere
- **Decision:** **Reference**

### 52. [nicolomantini/LinkedIn-Easy-Apply-Bot](https://github.com/nicolomantini/LinkedIn-Easy-Apply-Bot) — 43/100

- **Purpose:** Selenium LinkedIn Easy Apply automation
- **GitHub description:** Automate the application process on LinkedIn
- **Stars / forks / open issues+PRs:** 1,163 / 416 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-07 (50 days before check) · created 2018-12-08
- **Primary language / detected stack:** Python / Selenium
- **Licence:** Apache-2.0 — commercial reuse: permitted with notice
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** LinkedIn UI
- **Engineering signals:** 22 files · 0 test files · 1 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Automates logged-in LinkedIn actions; ToS violation; credentials handled in local config
- **Cloudflare Workers compatibility (0/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** No tests; auto-submit design
- **Decision:** **Avoid**

### 53. [weicanie/prisma-ai](https://github.com/weicanie/prisma-ai) — 42/100

- **Purpose:** Chinese job-search co-pilot: resume, matching, interview prep
- **GitHub description:** 你的求职AI co-pilot，优化你的项目，定制你的简历，为你匹配工作，并帮助你做好面试准备。此外，还提供一个免费的面经导向的面向offer学习网站：https://pinkprisma.com  Your AI job-hunting co-pilot, optimizing your projects, customizing your resume, matching you with jobs, and helping you prepare for interviews.
- **Stars / forks / open issues+PRs:** 418 / 40 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-02-17 (282 days before check) · created 2025-06-06
- **Primary language / detected stack:** TypeScript / —
- **Licence:** AGPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** LLMs; NestJS
- **Engineering signals:** 1048 files · 4 test files · 6 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** AGPL
- **Cloudflare Workers compatibility (2/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** Feature inventory
- **Limitations / reasons not to reuse:** AGPL; region focus
- **Decision:** **Reference (AGPL)**

### 54. [adrianhajdin/job_pilot](https://github.com/adrianhajdin/job_pilot) — 35/100

- **Purpose:** Tutorial AI job-search assistant
- **GitHub description:** AI-powered job search assistance for matching roles, tailored resumes, and faster applications.
- **Stars / forks / open issues+PRs:** 143 / 50 / 0 (checked 2026-11-26)
- **Last commit on default branch:** 2026-06-06 (173 days before check) · created 2026-06-03
- **Primary language / detected stack:** TypeScript / Next.js, React, Playwright, OpenAI SDK, PDF libs
- **Licence:** NONE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** OpenAI; Next.js
- **Engineering signals:** 116 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** No licence
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** No licence; tutorial code
- **Decision:** **Avoid**

### 55. [OmkarPathak/pyresparser](https://github.com/OmkarPathak/pyresparser) — 34/100

- **Purpose:** spaCy/NLTK resume parser
- **GitHub description:** A simple resume parser used for extracting information from resumes
- **Stars / forks / open issues+PRs:** 957 / 439 / 45 (checked 2026-11-26)
- **Last commit on default branch:** 2023-09-13 (1170 days before check) · created 2019-07-01
- **Primary language / detected stack:** Python / PDF libs
- **Licence:** GPL-3.0 — commercial reuse: copyleft obligations
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Local NLP
- **Engineering signals:** 38 files · 1 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** GPL-3.0; unmaintained since 2023
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** GPL; stale; outdated NLP models
- **Decision:** **Avoid**

### 56. [borgius/jobspy-mcp-server](https://github.com/borgius/jobspy-mcp-server) — 30/100

- **Purpose:** MCP wrapper around JobSpy
- **GitHub description:** MCP server to search for jobs across multiple job listing platforms
- **Stars / forks / open issues+PRs:** 130 / 45 / 3 (checked 2026-11-26)
- **Last commit on default branch:** 2026-03-13 (258 days before check) · created 2025-04-14
- **Primary language / detected stack:** JavaScript / —
- **Licence:** NONE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** JobSpy (incl. LinkedIn scraping)
- **Engineering signals:** 26 files · 2 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** No licence; inherits JobSpy ToS issues
- **Cloudflare Workers compatibility (3/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** No licence; thin wrapper
- **Decision:** **Avoid**

### 57. [Anshul439/job-auto-apply](https://github.com/Anshul439/job-auto-apply) — 28/100

- **Purpose:** Playwright auto-apply for Wellfound/Instahyre
- **GitHub description:** Automates one-click job applications on Wellfound and Instahyre
- **Stars / forks / open issues+PRs:** 283 / 32 / 2 (checked 2026-11-26)
- **Last commit on default branch:** 2026-10-15 (42 days before check) · created 2026-08-31
- **Primary language / detected stack:** TypeScript / Playwright
- **Licence:** NONE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Site UIs
- **Engineering signals:** 18 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: yes · dependency bot: no
- **Security & privacy:** No licence; automated submission
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Non-compliant, no licence
- **Decision:** **Avoid**

### 58. [binoydutt/Resume-Job-Description-Matching](https://github.com/binoydutt/Resume-Job-Description-Matching) — 22/100

- **Purpose:** Notebook-era resume/JD similarity project
- **GitHub description:** The purpose of this project was to defeat the current Application Tracking System used by most of the organization to filter out resumes. In order to achieve this goal I had to come up with a universal score which can help the applicant understand the current status of the match.  The following steps were undertaken for this project 1) Job Descriptions were collected from Glass Door Web Site using Selenium as other scrappers failed 2) PDF resume parsing using PDF Miner 3) Creating a vector representation of each Job Description - Used word2Vec to create the vector in 300-dimensional vector space with each document represented as a list of word vectors 4) Given each word its required weights to counter few Job Description specific words to be dealt with - Used TFIDF score to get the word weights. 5) Important skill related words were given higher weights and overall mean of each Job description was obtained using the product for word vector and its TFIDF scores 6) Cosine Similarity was used get the similarities of the Job Description and the Resume 7) Various Natural Language Processing Techniques were identified to suggest on the improvements in the resume that could help increase the match score
- **Stars / forks / open issues+PRs:** 190 / 88 / 3 (checked 2026-11-26)
- **Last commit on default branch:** 2018-05-28 (3104 days before check) · created 2018-05-28
- **Primary language / detected stack:** Python / —
- **Licence:** NONE — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: library / local
- **Data sources & integrations:** Local
- **Engineering signals:** 20 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** No licence; 2018
- **Cloudflare Workers compatibility (1/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Unmaintained, no licence
- **Decision:** **Avoid**

### 59. [wodsuz/EasyApplyJobsBot](https://github.com/wodsuz/EasyApplyJobsBot) — 21/100

- **Purpose:** Selenium bot applying on LinkedIn/Glassdoor Easy Apply
- **GitHub description:** A python bot to automatically apply all Linkedin,Glassdoor, etc Easy Apply jobs based on your preferences. Auto login, auto fill additional questions, apply automatically!
- **Stars / forks / open issues+PRs:** 839 / 226 / 62 (checked 2026-11-26)
- **Last commit on default branch:** 2026-03-29 (242 days before check) · created 2021-08-09
- **Primary language / detected stack:** Python / Selenium
- **Licence:** CC BY-NC-style (non-commercial) — commercial reuse: restricted / not permitted
- **Database / hosting signals:** none detected; deploy: Docker
- **Data sources & integrations:** LinkedIn/Glassdoor UI with stealth options
- **Engineering signals:** 14 files · 0 test files · 0 CI workflows · SECURITY.md: no · CONTRIBUTING: no · lockfile: no · dependency bot: no
- **Security & privacy:** Stealth/evasion; CC BY-NC-style licence (non-commercial)
- **Cloudflare Workers compatibility (0/10):** not compatible as-is; logic must be re-implemented
- **Worth reusing:** None
- **Limitations / reasons not to reuse:** Non-commercial licence; evasion; no tests
- **Decision:** **Avoid**
