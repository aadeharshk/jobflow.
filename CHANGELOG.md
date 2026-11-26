# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [0.1.0] — Phase 3 foundation (unreleased)

### Added

- Cloudflare-native skeleton: one Worker serving a Hono API and the React SPA via Workers Static Assets.
- D1 databases (`jobflow-core`, `jobflow-jobs`) with SQL migrations and Drizzle mirrors.
- Google sign-in (OIDC, PKCE, sign-in scopes only), hashed-token sessions, dev login for local/testing.
- User management: profile, sessions list/revoke, automation settings, activity feed, JSON data export, permanent account deletion.
- Private résumé storage in R2 (PDF magic-byte validation, size and count limits, ownership checks).
- Durable Objects: `OutboundGovernor` (20 messages / rolling 24 h, pause, idempotency) and `SourceLimiter` (token bucket).
- Queues (discovery, enrich-match, outbound, inbox-sync + DLQ) with versioned message contracts; hourly and daily Cron Triggers.
- Envelope encryption utilities for future OAuth tokens; fail-closed configuration validation.
- Module extension points for discovery (compliance-typed adapters), matching, email (send-only) and application tracking.
- CI (lint, format, typecheck, unit + E2E tests, build, audit, dependency review, CodeQL), manual gated deploy workflow.
- Documentation: deployment guide, checklist, secrets, database, API, costs & paid features, brand name check.

### Research (Phases 0–1)

- 175-repository benchmark, reuse matrix, architecture, ADRs, cost model, roadmap and launch plan.
