#!/usr/bin/env bash
# Creates JobFlow's Cloudflare resources in YOUR account (idempotent: existing resources are kept).
# Usage: npx wrangler login && npm run cf:setup [-- staging]
# Requires the Workers Paid plan for production use (see docs/deployment/cloudflare-deployment.md).
set -uo pipefail

SUFFIX=""
if [ "${1:-}" = "staging" ]; then SUFFIX="-staging"; fi
W="npx wrangler"

step() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }
try() { "$@" 2>&1 | grep -vE "Proxy environment" || true; }

step "Checking authentication"
$W whoami || { echo "Run 'npx wrangler login' first."; exit 1; }

step "D1 databases"
try $W d1 create "jobflow-core$SUFFIX"
try $W d1 create "jobflow-jobs$SUFFIX"

step "R2 bucket (private)"
try $W r2 bucket create "jobflow-files$SUFFIX"

step "Queues (+ dead-letter queue)"
for q in discovery enrich-match outbound inbox-sync dlq; do
  try $W queues create "jobflow-$q$SUFFIX"
done

step "Database IDs — paste these into wrangler.jsonc (database_id)"
$W d1 list --json 2>/dev/null | node -e '
  let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
    try { for (const db of JSON.parse(s)) if (db.name.startsWith("jobflow-")) console.log(`  ${db.name.padEnd(26)} ${db.uuid}`); }
    catch { console.log("  (could not parse; run: npx wrangler d1 list)"); }
  });'

cat <<MSG

Next steps:
  1. Put the IDs above into wrangler.jsonc (${SUFFIX:+env.staging section, }d1_databases[].database_id) and set APP_URL.
  2. Set secrets (never commit them):
       npx wrangler secret put GOOGLE_CLIENT_ID ${SUFFIX:+--env staging}
       npx wrangler secret put GOOGLE_CLIENT_SECRET ${SUFFIX:+--env staging}
       openssl rand -base64 32 | npx wrangler secret put TOKEN_ENCRYPTION_KEY ${SUFFIX:+--env staging}
  3. npm run db:migrate:remote${SUFFIX:+ -- --env staging}
  4. npm run deploy${SUFFIX:+ -- --env staging}
See docs/deployment/deployment-checklist.md.
MSG
