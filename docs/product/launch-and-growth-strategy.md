# Launch & Growth Strategy

> Principles: real user value, privacy, reliability, developer experience. No fake stars, reviews, metrics or engagement. No promises of virality. These are plans, not results.

## 1. Product identity

- **Working name:** JobFlow. _Risk:_ the name is generic and likely already used by other products and domains. Before investing in branding, run a trademark search (India IP office, USPTO, EUIPO), a domain check and a GitHub/npm name check. Have 2–3 backup names ready that suggest _intelligence + trust_ rather than spam-volume automation.
- **Promise (one line):** _"Find the right jobs worldwide, apply with your approval, and follow up once, from your own Gmail."_
- **Brand pillars:** Transparent (every score explained) · Respectful (20/day cap, human approval) · Private (your data, exportable, deletable) · Open (self-host on Cloudflare in minutes).
- **Visual identity:** one accent colour, a neutral palette, light and dark themes, a calm and premium look. Dashboard screenshots must show real UI with clearly labelled demo data.

## 2. Landing page (Phase 9, drafted in Phase 8)

Structure:

1. **Hero:** the promise, a "Get started free" button, a "Self-host on Cloudflare" button, and a 20-second product loop.
2. **Problem:** hours on job boards, unanswered applications, spammy auto-apply tools.
3. **How it works:** Profile → Matches with reasons → Approve → Gmail send → Reply detection → One follow-up.
4. **Trust:** the 20/day cap, the compliance stance, the data-handling summary, Google OAuth scope explanations.
5. **Open source:** GitHub link, architecture diagram, "deploy in 15 minutes".
6. **FAQ** (LinkedIn support, Gmail permissions, pricing, self-hosting), then a footer with privacy policy, terms and security policy.

**SEO:** pre-rendered pages, unique titles and meta descriptions, Open Graph images, `sitemap.xml`, `robots.txt`, structured data (`SoftwareApplication`, `FAQPage`). Content pages target long-tail searches such as "how to find jobs on Greenhouse boards", "data engineer remote jobs India", "how to follow up on a job application email" and "self-hosted job tracker Cloudflare". Each page must be genuinely useful; no thin programmatic spam pages.

## 3. Demo account & walkthrough

- A **read-only demo workspace** with synthetic, clearly labelled sample data (fictional companies), so no real person's data or fake claims about real employers. The demo never sends email.
- A 90-second walkthrough video: upload résumé → matches with explanations → prepare → approve → (simulated) reply detected → analytics.

## 4. GitHub presence (make it worth starring)

- **README:** a sentence of value, a GIF, a feature list, a live demo link, a "Deploy to Cloudflare" button, the architecture diagram, a 5-step local quick start, links to docs and roadmap.
- **Engineering quality signals:** green CI badges, test coverage, OpenAPI docs, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md, issue/PR templates, `good first issue` labels, Discussions enabled, a release-please changelog, semantic versioning.
- **Contributor magnets:** "Add a job source adapter" is the ideal first contribution. It is small and self-contained, with a fixture-test template and an adapter checklist (terms reviewed, rate limits, robots). Each region a contributor adds increases the product's value worldwide.
- **The research itself is content:** the reproducible 175-repository benchmark (`docs/research/`) can be published as a blog post: "We audited 175 open-source job & email automation repos: here's what's safe to reuse."

## 5. Launch sequence

| Week        | Action                                                                                                                                                                                                            | Channel                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| −6 to −2    | Build in public: weekly progress posts (architecture decisions, compliance stance, research findings)                                                                                                             | LinkedIn (Harsh's primary network), X, dev.to/Hashnode                 |
| −4          | Private beta: 20–50 job seekers from the personal network, college groups and UPNXTWork users; weekly feedback calls                                                                                              | Direct outreach, WhatsApp/Telegram communities (with admin permission) |
| −2          | Fix the top 5 friction points; record the walkthrough; finalise the landing page                                                                                                                                  | —                                                                      |
| 0 (Tue/Wed) | **Product Hunt** launch: maker comment explaining the "trustworthy automation" angle; reply to every comment personally                                                                                           | Product Hunt                                                           |
| 0           | **Show HN** focused on the Cloudflare-only architecture and the compliance-first design                                                                                                                           | Hacker News                                                            |
| 0–1         | Subreddits where self-promotion is permitted and rules are followed: r/selfhosted (self-host angle), r/CloudFlare (architecture), r/cscareerquestions / r/developersIndia (only in allowed threads), r/opensource | Reddit                                                                 |
| 0–2         | Technical deep-dive posts: "Enforcing a hard 20-emails/24h cap with Durable Objects"; "Gmail API on Cloudflare Workers without googleapis"; "Explainable job matching with FTS5 + embeddings"                     | dev.to, Hashnode, Cloudflare community, LinkedIn articles              |
| 2+          | Partnerships: college placement cells, bootcamps, career coaches (team edition); a cross-link with UPNXTWork                                                                                                      | Direct                                                                 |

**Product Hunt checklist:** hunter (or self-hunt), tagline under 60 characters, 4–6 gallery images of real UI with demo data, the video, a first comment, an offer for PH users (e.g. extended Pro trial). Never ask for upvotes in groups, which violates PH rules.

## 6. Feedback, transparency & support

- **Public roadmap:** a GitHub Project board linked from the app.
- **Changelog:** generated by release-please and shown in-app ("What's new").
- **Bug reports and feature requests:** GitHub issue forms (bug, feature, new job source, security issues kept private via GitHub Security Advisories), plus an in-app "Send feedback" button that pre-fills the browser, version and route (no PII).
- **Status and incidents:** a simple status page section in the docs.

## 7. Analytics for activation & retention

Instrumented with first-party events (ADR-013). Weekly review of:

- the activation funnel (sign-up → profile confirmed → 5 matches viewed → Gmail connected → first approved application),
- week-1/week-4 retention,
- reply and interview rate per 100 applications,
- bounce and complaint rate,
- sources producing the most interviews (this feeds source prioritisation).

## 8. Revenue path (for the hosted edition)

1. **Free** (discovery, matching, tracking, limited sends) to build trust and word of mouth.
2. **Pro subscription** (full governed sending, tailoring, reply intelligence, analytics); price tested at ₹499–999/month in India and $9–15/month globally.
3. **Team / institution** edition for placement cells and bootcamps (cohort dashboards).
4. **Self-hosted** stays free under the open-source licence. That is the trust and contributor engine, not a competitor.

## 9. Risks & mitigations

| Risk                                                               | Mitigation                                                                                                                       |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Google restricted-scope verification delays hosted reply detection | Launch send-only with manual reply logging; self-host path fully functional; start verification early (Phase 7)                  |
| A job source changes its terms or API                              | Source registry with `terms_reviewed_at`; adapters are isolated and can be disabled by a flag; fixture tests detect schema drift |
| Users expect "auto-apply to 500 jobs"                              | Clear messaging: quality over volume; show that reply-rate analytics beat spray-and-pray                                         |
| Name conflict                                                      | Trademark/domain check before any branding spend                                                                                 |
| LLM hallucination in applications                                  | Fact-check pass against the confirmed profile; the user approves every send                                                      |
