# JobFlow

**A global AI job-intelligence and application-automation platform, built entirely on Cloudflare.**

JobFlow finds roles worldwide from permitted sources and explains why each one fits your profile. It prepares a tailored application and sends it from your own Gmail **with your approval**. It then detects genuine replies and follows up **once** if no one answers. Every outbound message counts toward a hard cap of 20 per rolling 24 hours.

> 🚧 **Status: Phase 1 — research & architecture proposal. No application code yet.**
> The main application is built only after the architecture is approved (Phase 2 gate).

## What's here now

| Document | What it contains |
|---|---|
| [`docs/research/job-search-repositories.md`](docs/research/job-search-repositories.md) | 59 job-search / recruitment repositories, scored out of 100 and ranked |
| [`docs/research/email-automation-repositories.md`](docs/research/email-automation-repositories.md) | 65 Gmail / email / communication repositories, scored and ranked |
| [`docs/research/ai-and-automation-repositories.md`](docs/research/ai-and-automation-repositories.md) | 29 AI, browser-automation, parsing, search and analytics projects |
| [`docs/research/cloudflare-references.md`](docs/research/cloudflare-references.md) | 22 Cloudflare reference repositories + the pricing and limits appendix |
| [`docs/research/repository-comparison-matrix.md`](docs/research/repository-comparison-matrix.md) | Reuse decisions per JobFlow module + third-party code policy |
| [`docs/architecture/system-architecture.md`](docs/architecture/system-architecture.md) | Architecture diagram, core flows, data model, security model |
| [`docs/architecture/technology-decisions.md`](docs/architecture/technology-decisions.md) | 13 ADRs + open questions for approval |
| [`docs/architecture/cloudflare-cost-analysis.md`](docs/architecture/cloudflare-cost-analysis.md) | Monthly cost model: single user, 100, 1k and 10k users |
| [`docs/product/product-roadmap.md`](docs/product/product-roadmap.md) | Phased delivery plan and success metrics |
| [`docs/product/launch-and-growth-strategy.md`](docs/product/launch-and-growth-strategy.md) | Branding, landing page, GitHub, launch and feedback plan |

All research is reproducible: see [`scripts/research/`](scripts/research/) and § 5 of the comparison matrix.

## Principles

- **Compliance first.** Official APIs and public feeds only. No LinkedIn scraping, no CAPTCHA bypass, no stealth browsers, no automatic submission of third-party forms.
- **Human in the loop.** You approve every application. There is one follow-up at most, and a 20 messages / 24 h cap.
- **Explainable.** Every match score breaks down into reasons you can read.
- **Private.** Encrypted tokens, minimal Gmail scopes, full data export and deletion.
- **Open and self-hostable.** Deploy to your own Cloudflare account.

## Planned stack

Cloudflare Workers (Hono API + Static Assets SPA) · D1 (Drizzle) · R2 · Queues · Cron Triggers · Durable Objects · Workers AI · Secrets · React + Vite + Tailwind · Gmail API via OAuth 2.0.
