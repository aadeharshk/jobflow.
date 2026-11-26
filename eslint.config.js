import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".wrangler/**",
      "scripts/research/**",
      "playwright-report/**",
      "test-results/**",
      "worker/worker-configuration.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["worker/**/*.ts"],
    languageOptions: { globals: { ...globals.serviceworker } },
  },
  {
    files: ["web/src/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    files: ["web/public/**/*.js"],
    languageOptions: { globals: { ...globals.browser }, sourceType: "script" },
  },
  {
    files: ["**/*.config.{ts,js}", "e2e/**/*.ts", "scripts/**/*.{js,ts}"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "no-console": "off",
      eqeqeq: ["error", "always"],
    },
  },
);
