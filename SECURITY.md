# Security Policy

## Reporting a vulnerability

Please **do not** open public issues for security problems. Report privately via
[GitHub Security Advisories](https://github.com/aadeharshk/jobflow./security/advisories/new).
You will receive an acknowledgement within 3 working days and a status update within 10 working days.
Please include steps to reproduce, affected versions/commit and impact. We support coordinated disclosure and will credit reporters who wish to be named.

## Supported versions

Only the latest `main` branch and the most recent release receive security fixes during the 0.x series.

## Security design (summary)

- **Authentication:** Google OIDC (authorization code + PKCE, state check) with sign-in scopes `openid email profile` only. Sessions are random 256-bit tokens; only their SHA-256 hash is stored. Cookies are `HttpOnly`, `SameSite=Lax`, `Secure` + `__Host-` prefix on HTTPS. 30-day sliding expiry; users can revoke sessions.
- **CSRF:** every state-changing API request must carry an allowed `Origin` (or same-origin Fetch Metadata), in addition to SameSite cookies.
- **Secrets:** stored only as Cloudflare Secrets (`wrangler secret put`); configuration is validated at startup and production **fails closed** if secrets are missing, dev login is enabled, or `APP_URL` is not HTTPS.
- **Token encryption (for Gmail, Phase 6):** AES-256-GCM envelope encryption with per-user data keys wrapped by `TOKEN_ENCRYPTION_KEY`, with the user ID bound as authenticated data.
- **Files:** résumés in a private R2 bucket, served only through ownership-checked routes; content type verified by magic bytes; size-limited.
- **Abuse controls:** Workers Rate Limiting on auth and API routes; per-user OutboundGovernor Durable Object enforces at most 20 outbound messages per rolling 24 hours and a pause switch.
- **Headers:** strict CSP, `X-Frame-Options: DENY`, `nosniff`, HSTS on HTTPS, `no-store` on API responses.
- **Compliance:** no scraping of sites that forbid automated access (LinkedIn, Indeed, Glassdoor are blocked hosts), no CAPTCHA bypass, no automatic third-party form submission.
- **Supply chain:** exact-pinned dependencies, npm `allowScripts` allow-list (only `esbuild`, `workerd`), SHA-pinned GitHub Actions, CodeQL, `npm audit`, dependency review, Dependabot.
- **Privacy:** data export and permanent account deletion are available to every user; audit log entries are de-identified on deletion.
