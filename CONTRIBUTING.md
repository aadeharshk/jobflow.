# Contributing to JobFlow

Thanks for helping build a trustworthy job-search tool! By contributing you agree that your contributions are licensed under Apache-2.0 and that you follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Local setup (≈5 minutes)

```bash
git clone https://github.com/aadeharshk/jobflow..git && cd jobflow.
npm install -g npm@11.21.2   # npm 10 has a resolver bug with vitest 4
npm ci
cp .dev.vars.example .dev.vars   # dev login is enabled; Google OAuth optional
npm run db:migrate:local
npm run dev                       # http://localhost:8787
```

Use `npm run dev:web` in a second terminal for hot-reloading UI on http://localhost:5173 (proxies `/api` to 8787).

## Before opening a PR

```bash
npm run check        # lint + typecheck + unit tests + build
npm run test:e2e     # Playwright (installs nothing if browsers already present)
```

- Keep PRs focused; include tests for new behaviour (Workers tests run in the real runtime via `@cloudflare/vitest-plugin`).
- New SQL goes in a **new** numbered migration under `migrations/core` or `migrations/jobs`; update the Drizzle mirror in `worker/src/db/`.
- Never commit secrets, `.dev.vars`, real user data or recorded responses containing personal data.
- Dependencies: exact versions, permissive licences only (MIT/Apache/BSD/ISC). Explain why a new dependency is needed.

## Adding a job source (great first contribution — from Phase 4)

Each adapter must implement `SourceAdapter` (`worker/src/modules/discovery/types.ts`) and pass `assertCompliant`:
official API, public feed, or robots.txt-permitted public page; a reviewed terms URL; documented rate limits.
Scraping sites whose terms forbid it, bypassing CAPTCHAs/bot protection or automating logged-in sessions will not be accepted.

## Commit style

Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …) — they feed the changelog.
