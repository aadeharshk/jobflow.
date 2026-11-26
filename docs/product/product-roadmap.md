# JobFlow Product Roadmap

> This roadmap is public by design and will be mirrored as a GitHub Project once the repository is public. Every phase ships something deployable and tested. **A feature is "done" only when it works end-to-end, has tests, passes type checks and lint, has had a security review, and is documented.**

## Positioning

**JobFlow: the trustworthy AI job copilot.** It finds roles worldwide, explains why each one fits, prepares a tailored application, sends it from your own Gmail with your approval, and follows up once.

| Typical alternatives                         | JobFlow's difference                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Job boards (LinkedIn, Indeed, Naukri)        | One profile, every permitted source, an explainable match score, a direct employer link   |
| Auto-apply bots                              | Human approval, compliance with site terms, a 20/day cap: no spam, no account bans        |
| Local agent CLIs (career-ops, ai-job-search) | A web app any job seeker can use in 5 minutes, plus one-click self-hosting for developers |
| Spreadsheets / trackers                      | Automatic pipeline: sent → replied → interview, with real response analytics              |

## Phase plan

| Phase    | Theme                               | Key deliverables                                                                                                                                                                                                                                                                                           | Exit criteria                                                                                          |
| -------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **0** ✅ | Research                            | 175 repositories evaluated; reuse matrix; architecture; cost model; roadmap; launch plan                                                                                                                                                                                                                   | These documents, reviewed                                                                              |
| **1** ✅ | Proposal                            | Ranked results, ADRs, security model, phased plan presented                                                                                                                                                                                                                                                | Owner review                                                                                           |
| **2** ✅ | **Approval gate**                   | Owner approves the architecture and answers the open questions (licence, hosted scope, geography, name)                                                                                                                                                                                                    | Written approval                                                                                       |
| **3** 🔍 | Foundation (built, awaiting review) | Worker + SPA skeleton, design system (tokens, light/dark, core components), Google sign-in (arctic + hashed sessions), D1 schemas + migrations, R2 upload, CI (lint, typecheck, tests, audit, CodeQL), `.env.example`, deploy guide, repo hygiene files                                                    | `wrangler deploy` works on a clean account in under 15 minutes following the README; CI green          |
| **4**    | Profile & discovery                 | Résumé upload → unpdf → structured profile (user-confirmed); source registry + `SourceLimiter`; adapters for Greenhouse, Lever, Ashby, SmartRecruiters, Workable, Recruitee + 2 public job APIs; hourly Cron + discovery queue; liveness/closing; shared job index; search & filters UI                    | ≥10k live jobs indexed from compliant sources; adapters have fixture tests; search p95 < 300 ms        |
| **5**    | Matching & intelligence             | FTS5 + `bge-m3` embeddings + filter gates; explainable score breakdown UI; saved searches + daily digest; company career-page/ATS discovery; public-contact extraction with provenance                                                                                                                     | Users can see why each job ranks; no contact shown without a source URL                                |
| **6**    | Applications & Gmail send           | Application pipeline + timeline; tailored résumé / cover letter / email with fact-check pass; Gmail OAuth (incremental `gmail.send`, send-only at launch); MIME builder with R2 attachment; `OutboundGovernor` (20/rolling-24h, pause, idempotency, suppression)                                           | Property tests prove the cap can't be exceeded under concurrency; E2E send to a test inbox             |
| **7**    | Replies & follow-up                 | `history.list` sync; auto-reply/bounce filters; reply-parser; LLM classification (interview/rejection/info); one follow-up at ≥24 h only without a genuine reply; activity log; manual reply logging fallback                                                                                              | Classifier ≥90% accuracy on a labelled fixture set; follow-up never sent after a genuine reply (tests) |
| **8**    | Analytics & polish                  | Funnel dashboard (applications, response rate, interview rate, time-to-reply, by source/role); weekly insights; data export & account deletion; accessibility audit (WCAG 2.2 AA); performance budget                                                                                                      | Lighthouse ≥95 accessibility; export/delete verified                                                   |
| **9**    | Public launch                       | Landing page, demo account with safe sample data, walkthrough video, docs site, Product Hunt + community launch (see launch plan); Google OAuth verification for the hosted edition                                                                                                                        | Live URL; v1.0.0 release notes                                                                         |
| **10+**  | Expansion                           | More regions/sources (India: government portals with APIs, Naukri only if an official channel exists); Outlook/IMAP adapter; browser extension for user-side "save job" and form pre-fill (user clicks Submit); interview prep from JD; JobFlow MCP server; team/college placement-cell edition; Vectorize | Driven by user feedback and metrics                                                                    |

## Success metrics (instrumented from Phase 3)

- **Activation:** % of sign-ups who confirm a profile **and** view ≥5 matches within the first session (target ≥60%).
- **Time-to-value:** median minutes from sign-up to first relevant match (target <5).
- **Core action:** approved applications per weekly active user.
- **Outcome:** reply rate and interview rate per 100 applications. This is JobFlow's north-star "interviews generated".
- **Retention:** week-4 retention of activated users (target ≥30%).
- **Trust:** spam complaints / bounces per 1,000 sends (target <2); zero cap violations.
- **Open source:** time-to-first-deploy for contributors, merged external PRs/month.

## Explicitly out of scope

Auto-submitting third-party forms, LinkedIn scraping or automation, CAPTCHA bypass, purchased contact databases, guessed email addresses, and multi-step cold-email sequences.
