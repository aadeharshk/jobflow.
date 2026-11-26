#!/usr/bin/env bash
# Starts a fully local JobFlow (Miniflare D1/R2/Queues/DO) for end-to-end tests.
set -euo pipefail
npm run build:web
npx wrangler d1 migrations apply DB_CORE --local
npx wrangler d1 migrations apply DB_JOBS --local
exec npx wrangler dev --port 8787 --ip 127.0.0.1 \
  --var ENVIRONMENT:development \
  --var APP_URL:http://localhost:8787 \
  --var AUTH_DEV_LOGIN:true
