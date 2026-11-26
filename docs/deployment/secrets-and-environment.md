# Secrets & Environment Management

## Principles

1. **Secrets only in Cloudflare Secrets** (`wrangler secret put`), or in a local git-ignored `.dev.vars` for development. They never go in `wrangler.jsonc`, GitHub secrets, logs or the database.
2. **Fail closed.** `worker/src/env.ts` validates configuration once per isolate. In `staging`/`production`, a missing Google secret, a missing or weak `TOKEN_ENCRYPTION_KEY`, an `http://` `APP_URL` or `AUTH_DEV_LOGIN=true` makes every API request return `503 misconfigured` instead of running insecurely.
3. **Least privilege.** The CI token can deploy but cannot read application secrets. Sign-in requests only `openid email profile`.

## Variables (`wrangler.jsonc` → `vars`, non-secret)

| Name               | Production value | Purpose                                                                                |
| ------------------ | ---------------- | -------------------------------------------------------------------------------------- |
| `ENVIRONMENT`      | `production`     | One of `development`, `test`, `staging`, `production`                                  |
| `APP_URL`          | `https://…`      | Public origin; used for OAuth redirects, CSRF origin check and secure-cookie decisions |
| `AUTH_DEV_LOGIN`   | `"false"`        | Local passwordless sign-in; refused outside development/test                           |
| `MAX_RESUME_BYTES` | `5242880`        | Upload limit (≤ 20 MB)                                                                 |

## Secrets (`wrangler secret put NAME [--env staging]`)

| Name                   | Required in prod | How to create              | Rotation                                                                                                                |
| ---------------------- | ---------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Yes              | Google Cloud → Credentials | When the client is recreated                                                                                            |
| `GOOGLE_CLIENT_SECRET` | Yes              | Same                       | Rotate in Google (add a new secret, deploy, delete the old one)                                                         |
| `TOKEN_ENCRYPTION_KEY` | Yes              | `openssl rand -base64 32`  | Planned re-wrap procedure in Phase 6 (`key_version` column already exists). Never delete the old key before re-wrapping |

## Local development

```bash
cp .dev.vars.example .dev.vars   # git-ignored
# optional: fill GOOGLE_CLIENT_ID/SECRET to test real Google sign-in locally
# TOKEN_ENCRYPTION_KEY: openssl rand -base64 32
```

`wrangler dev` reads `.dev.vars`. The automated E2E server passes development values with `--var` flags, so no file is needed in CI.

## Bindings (no credentials involved)

D1 (`DB_CORE`, `DB_JOBS`), R2 (`FILES`), Queues (`Q_*`), Durable Objects (`OUTBOUND_GOVERNOR`, `SOURCE_LIMITER`), Rate Limiting (`AUTH_RATE_LIMITER`, `API_RATE_LIMITER`), static assets (`ASSETS`). Bindings are capability-based: code can only reach resources declared in `wrangler.jsonc`.

## Incident: suspected secret leak

1. Rotate the secret at its source (Google console, or generate a new key).
2. `npx wrangler secret put NAME` with the new value. Deploys pick it up immediately.
3. For a session-compromise scenario: `DELETE FROM sessions;` via `npx wrangler d1 execute jobflow-core --remote --command "DELETE FROM sessions"`, which forces everyone to sign in again.
4. Record the incident in `audit_log` notes and the changelog's security section.
