# Cloudflare Cost Analysis

> Prices come from the `cloudflare/cloudflare-docs` repository (commit dated 2026-11-26); see `docs/research/cloudflare-references.md` Appendix A. They were **not** read from the live pricing pages, which were unreachable from the research environment. Re-verify before committing a budget. All figures are USD per month and are **estimates driven by the stated assumptions**. They are not quotes.

## 1. Assumptions

| Driver | Single user (self-host) | 100 users | 1,000 users | 10,000 users |
|---|---:|---:|---:|---:|
| Company boards tracked (shared) | 200 | 2,000 | 5,000 | 15,000 |
| Share of boards on hourly tier (others every 6 h) | 50% | 30% | 30% | 30% |
| Jobs changed/new per day (shared index) | 500 | 8,000 | 25,000 | 60,000 |
| API requests per active user/day | 100 | 150 | 200 | 200 |
| Match rows written per user/day | 100 | 150 | 150 | 150 |
| Emails sent per user/day (average; cap 20) | 8 | 8 | 8 | 8 |
| Inbox-sync checks | every 10 min for the 50% of users with open threads | same | same | same |
| LLM tokens per user/day (extraction, classification, drafting) | 30k in / 6k out | same | same | same |
| Embedding tokens per day (shared jobs + profiles) | 0.2M | 3M | 10M | 25M |
| Browser Rendering hours/month (JS-only career pages) | 0 | 5 | 30 | 120 |
| Average CPU per invocation | 5 ms API · 15 ms discovery · 20 ms match/send · 8 ms inbox | same | same | same |

## 2. Monthly estimate

| Line item | Single user | 100 users | 1,000 users | 10,000 users |
|---|---:|---:|---:|---:|
| Workers Paid subscription | $5.00 | $5.00 | $5.00 | $5.00 |
| Workers requests + CPU (beyond included) | $0.00 | $0.00 | $1.19 | $27.80 |
| Queues (≈3 ops per message) | $0.00 | $0.89 | $5.18 | $35.96 |
| D1 rows + storage | $0.00 | $0.00 | $0.00 | $66.78 |
| R2 storage + operations | $0.00 | $0.00 | $0.00 | ≈$27.75 |
| Durable Objects | $0.00 | $0.00 | $0.00 | $1.02 |
| Workers AI (beyond the 10k neurons/day free allowance) | $0.00 | ≈$8.40 | ≈$106.50 | ≈$1,067.70 |
| Browser Rendering | $0.00 | $0.00 | $1.80 | $9.90 |
| Cron Triggers, static assets, egress | $0.00 | $0.00 | $0.00 | $0.00 |
| **Total** | **≈$5** | **≈$14** | **≈$120** | **≈$1,242** |
| **Per active user** | $5.00 | $0.14 | $0.12 | $0.12 |

**Volumes behind the 1,000-user case:** about 6.5M Worker requests, 90M CPU-ms, 13.9M queue operations, 12.2M D1 rows written, 1.9B rows read, and storage under 5 GB per D1 database.

**Self-hosting on the Free plan.** A single user can fit inside Workers Free (100k requests/day, 10k queue ops/day, 100k D1 writes/day, free SQLite DOs, 10k neurons/day). The catches are the 10 ms CPU per invocation limit and the 5 Cron Triggers per account limit. PDF parsing and LLM-heavy steps can exceed 10 ms CPU, so the documented recommendation for self-hosters is **Workers Paid at $5/month**.

## 3. What actually drives cost

1. **AI is 85–90% of the variable cost.** At $0.12 per user/month the economics are healthy, but the levers matter:
   - The LLM rubric runs only on the top 20 matches per user per day; everything else uses cheap embeddings and FTS.
   - Drafts are generated only on **Prepare**, not for every match.
   - Extraction results are cached per job (the shared index means one extraction serves every user).
   - Bring-your-own-key users move their LLM cost off the platform.
2. **Shared job ingestion makes discovery cost scale with the number of companies, not users.** The 10,000-user discovery cost is driven by 15,000 boards, not by 10,000 users.
3. **Conditional requests (`ETag`/`If-Modified-Since`) and activity tiering** cut discovery fetches by an estimated 50–70%. These savings are *not* included above, so the estimates are conservative.
4. **D1 storage limit, not price, is the first scaling wall** (10 GB per database). See ADR-004 for the Durable-Object-per-user migration path at about 5k users.

## 4. Costs outside Cloudflare (integrations)

| Item | Cost | Notes |
|---|---|---|
| Gmail API | $0 | Quota-based, no fee. Per-user and per-project quota units apply; re-check Google's quota page |
| Google OAuth verification (sensitive scope) | $0 | Requires a verified domain, privacy policy, demo video |
| Restricted-scope security assessment (CASA), needed for automated reply reading in the hosted edition | Historically about $500–$4,500/year depending on assessor and tier (*from general industry knowledge; not verified in-session*) | Not needed for self-hosters using their own OAuth client |
| Domain | ~$10–15/year | |
| Optional BYO LLM | Paid by the user | |
| Job APIs (Adzuna, USAJOBS, etc.) | Free tiers | Each has its own terms and limits; recorded in the source registry |

## 5. Pricing implications for a hosted plan

At about $0.12–0.15 infrastructure cost per active user per month, a freemium model is viable:
- **Free:** discovery + matching + manual tracking, 5 governed sends/day.
- **Pro (~₹499–999/month in India; ~$9–15/month globally):** the full 20/day governed sending, tailored documents, reply classification, single follow-up, analytics.

Gross margin would stay above 90% even with a CASA assessment amortised over a few hundred paying users. (Market validation of the price is part of the launch plan.)
