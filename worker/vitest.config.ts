import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Deterministic test-only key (NOT a secret; never used outside tests).
const TEST_KEY = Buffer.alloc(32, 7).toString("base64");

export default defineConfig(async () => {
  const coreMigrations = await readD1Migrations(path.join(root, "migrations/core"));
  const jobsMigrations = await readD1Migrations(path.join(root, "migrations/jobs"));
  return {
    root,
    plugins: [
      cloudflareTest({
        wrangler: { configPath: path.join(root, "wrangler.jsonc") },
        miniflare: {
          bindings: {
            ENVIRONMENT: "test",
            APP_URL: "http://localhost",
            AUTH_DEV_LOGIN: "true",
            MAX_RESUME_BYTES: "1048576",
            TOKEN_ENCRYPTION_KEY: TEST_KEY,
            GOOGLE_CLIENT_ID: "test-client-id.apps.googleusercontent.com",
            GOOGLE_CLIENT_SECRET: "test-client-secret",
            TEST_CORE_MIGRATIONS: coreMigrations,
            TEST_JOBS_MIGRATIONS: jobsMigrations,
          },
        },
      }),
    ],
    test: {
      include: ["worker/test/**/*.test.ts"],
      setupFiles: ["worker/test/setup.ts"],
    },
  };
});
