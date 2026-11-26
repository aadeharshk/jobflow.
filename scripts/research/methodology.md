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
