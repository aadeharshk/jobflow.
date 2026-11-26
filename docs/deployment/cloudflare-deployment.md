# Deploying JobFlow to Cloudflare

This guide deploys JobFlow to **your own Cloudflare account**. It takes about 20–30 minutes the first time. A condensed, tick-box version is in [`deployment-checklist.md`](deployment-checklist.md).

> All production infrastructure is Cloudflare: Workers (API + static assets), D1, R2, Queues, Durable Objects, Cron Triggers, Rate Limiting and Secrets. Google is used only for OAuth sign-in. No Supabase, Firebase, Vercel, AWS or external database.

## 0. Prerequisites

| Requirement                 | Notes                                                                                                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare account          | **Workers Paid ($5/month) recommended for production.** Phase 3 works on Free, but later phases need it (see [`../architecture/free-tier-and-paid-features.md`](../architecture/free-tier-and-paid-features.md)) |
| Node.js 22+ and npm 11.21.2 | `npm install -g npm@11.21.2` (npm 10 crashes resolving vitest 4's peer dependencies)                                                                                                                             |
| Google Cloud project        | For the OAuth 2.0 client (free)                                                                                                                                                                                  |
| `openssl`                   | To generate the encryption key                                                                                                                                                                                   |

```bash
git clone https://github.com/aadeharshk/jobflow..git && cd jobflow.
npm ci
npx wrangler login
```

## 1. Create the Cloudflare resources

```bash
npm run cf:setup            # production resources
npm run cf:setup -- staging # optional: staging resources with a -staging suffix
```

This creates `jobflow-core` and `jobflow-jobs` (D1), `jobflow-files` (R2, private), and five queues (`jobflow-discovery`, `jobflow-enrich-match`, `jobflow-outbound`, `jobflow-inbox-sync`, `jobflow-dlq`). At the end it prints the D1 database IDs. Durable Objects, Cron Triggers and Rate Limiting are created automatically by `wrangler deploy` from `wrangler.jsonc`.

## 2. Configure `wrangler.jsonc`

1. Replace the placeholder `database_id` values (`00000000-…`) with the IDs printed in step 1. The deploy workflow refuses to run while placeholders remain.
2. Set `vars.APP_URL` to your public HTTPS URL. Use `https://jobflow.<your-subdomain>.workers.dev`, or a custom domain (step 7).
3. Leave `ENVIRONMENT` as `production` and `AUTH_DEV_LOGIN` as `"false"`. Production refuses to start otherwise.
4. Optional: change the `ratelimits[].namespace_id` values if they clash with other Workers in your account. They must be unique per account.

D1 IDs and bucket names are **not secrets**; committing them is fine.

## 3. Create the Google OAuth client

1. In Google Cloud Console → **APIs & Services → OAuth consent screen**: choose _External_, fill in the app name, support email and app domain/privacy policy URL (required before going public).
2. **Scopes:** add only `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`. These are non-sensitive, so no verification is needed for sign-in. _(The Gmail `gmail.send` scope is added in Phase 6 and is requested incrementally.)_
3. **Credentials → Create credentials → OAuth client ID → Web application:**
   - Authorized JavaScript origin: your `APP_URL`
   - Authorized redirect URI: `${APP_URL}/api/auth/google/callback`
   - For local development, also add `http://localhost:8787` and `http://localhost:8787/api/auth/google/callback`.
4. While the consent screen is in **Testing** mode, add your Google accounts as test users. Publish it when ready.

## 4. Set secrets

Secrets live only in Cloudflare and are never committed or put in GitHub:

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
openssl rand -base64 32 | npx wrangler secret put TOKEN_ENCRYPTION_KEY
```

Add `--env staging` for staging. Store a copy of `TOKEN_ENCRYPTION_KEY` in your password manager: losing it makes stored OAuth tokens unrecoverable (users would reconnect Gmail). See [`secrets-and-environment.md`](secrets-and-environment.md).

## 5. Apply database migrations

```bash
npm run db:migrate:remote
# staging: npx wrangler d1 migrations apply DB_CORE --remote --env staging && npx wrangler d1 migrations apply DB_JOBS --remote --env staging
```

## 6. Deploy

```bash
npm run deploy      # builds the SPA into dist/web, then runs `wrangler deploy`
curl https://<your-app-url>/api/health
# {"status":"ok","environment":"production","checks":{"dbCore":true,"dbJobs":true}}
```

If any required secret is missing, `/api/health` returns `503 misconfigured`. This is intentional: the app fails closed.

## 7. Custom domain (optional)

Workers & Pages → `jobflow` → Settings → Domains & Routes → add a custom domain on a zone in your account. Then update `APP_URL`, the Google OAuth origin and redirect URI, and redeploy. Do not buy a domain until the name is final (see [`../product/brand-name-check.md`](../product/brand-name-check.md)).

## 8. Deploy from GitHub Actions (recommended after the first manual deploy)

1. In GitHub → Settings → Environments, create `staging` and `production`, and add **required reviewers** for production.
2. Add environment secrets:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`, created at Cloudflare → My Profile → API Tokens with _Workers Scripts: Edit_, _D1: Edit_, _Workers R2 Storage: Edit_, _Queues: Edit_, _Account Settings: Read_. Scope it to the account only.
3. Run **Actions → Deploy → Run workflow**. The workflow verifies, rejects placeholder IDs, applies migrations, deploys and smoke-tests `/api/health`.

## 9. Rollback

```bash
npx wrangler deployments list
npx wrangler rollback <deployment-id>
```

D1 migrations are forward-only. Write additive migrations, and use D1 **Time Travel** (point-in-time restore, `npx wrangler d1 time-travel restore jobflow-core --timestamp=<ISO>`) for emergency data recovery.

## 10. Observability

- `npx wrangler tail`: live logs (logs are structured and never contain tokens or résumé content).
- Dashboard → Workers → `jobflow` → Observability (enabled in `wrangler.jsonc`).
- Watch the `jobflow-dlq` queue depth. Messages there indicate failing background jobs (from Phase 4 on).

## Troubleshooting

| Symptom                                                                   | Fix                                                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `503 misconfigured` from `/api/health`                                    | A secret is missing or `APP_URL` is not HTTPS. Check `npx wrangler secret list`                   |
| Google says `redirect_uri_mismatch`                                       | The redirect URI must exactly equal `${APP_URL}/api/auth/google/callback`                         |
| `/signin?error=invalid_state`                                             | Cookies were blocked or the sign-in took longer than 10 minutes; retry                            |
| `npm ci` fails with `Cannot read properties of null (reading 'edgesOut')` | Upgrade npm: `npm install -g npm@11.21.2`                                                         |
| Rate limiting not enforced locally                                        | The Rate Limiting binding is per-location and best-effort; it is a guard rail, not a quota system |
