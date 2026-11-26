# Deployment Checklist

Use this for every new environment. Each item is verifiable.

## A. One-time account setup

- [ ] Cloudflare account created; **Workers Paid** plan enabled for production ($5/month; see the free-tier doc for what works on Free)
- [ ] `npx wrangler login` succeeds; `npx wrangler whoami` shows the right account
- [ ] Node 22+, `npm -v` → 11.21.2
- [ ] Google Cloud project created; OAuth consent screen configured with **only** `openid`, `email`, `profile`
- [ ] OAuth Web client created with origin `APP_URL` and redirect `APP_URL/api/auth/google/callback`

## B. Resources & configuration

- [ ] `npm run cf:setup` completed: 2 D1 databases, 1 R2 bucket, 5 queues created
- [ ] `wrangler.jsonc`: real `database_id` values (no `00000000-` placeholders)
- [ ] `wrangler.jsonc`: `APP_URL` is the final **https** URL; `ENVIRONMENT=production`; `AUTH_DEV_LOGIN="false"`
- [ ] Rate-limit `namespace_id`s are unique in the account

## C. Secrets (never in git, never in GitHub)

- [ ] `GOOGLE_CLIENT_ID` set (`npx wrangler secret list` shows it)
- [ ] `GOOGLE_CLIENT_SECRET` set
- [ ] `TOKEN_ENCRYPTION_KEY` set from `openssl rand -base64 32`, with a backup in a password manager
- [ ] `.dev.vars` is not committed (`git ls-files | grep dev.vars` returns nothing)

## D. Verify before deploy

- [ ] `npm ci && npm run check` passes (lint, typecheck, tests, build)
- [ ] `npm run test:e2e` passes locally or in CI
- [ ] CI is green on the commit being deployed

## E. Deploy

- [ ] `npm run db:migrate:remote` applied all migrations (re-running reports "No migrations to apply")
- [ ] `npm run deploy` succeeded
- [ ] `curl $APP_URL/api/health` → `{"status":"ok","environment":"production",...,"dbCore":true,"dbJobs":true}`

## F. Post-deploy smoke test (manual, ~5 minutes)

- [ ] Landing page loads over HTTPS; response has `Content-Security-Policy` and `X-Frame-Options: DENY`
- [ ] `curl -X POST -H "Origin: $APP_URL" -H "Content-Type: application/json" -d "{\"email\":\"a@b.co\"}" $APP_URL/api/auth/dev-login` returns **404** (dev login disabled in production)
- [ ] "Continue with Google" → Google consent shows only name/email/profile → returns to `/app`
- [ ] Session cookie is `__Host-jobflow_session`, `Secure`, `HttpOnly`, `SameSite=Lax` (DevTools → Application → Cookies)
- [ ] Upload a PDF résumé → it appears, downloads and deletes; a non-PDF is rejected
- [ ] Settings → Pause automation → the dashboard shows "Automation paused"
- [ ] Settings → Download my data → a JSON file is returned
- [ ] Sign out → `/app` redirects to sign-in
- [ ] Test account deleted via Settings → Delete account (verifies R2 + D1 cleanup)

## G. Operations

- [ ] GitHub Environments `staging`/`production` created with required reviewers and `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`
- [ ] Dependabot and CodeQL alerts enabled for the repository
- [ ] Cloudflare spending notification or budget alert configured
- [ ] Rollback rehearsed once: `npx wrangler deployments list` → `npx wrangler rollback <id>`
