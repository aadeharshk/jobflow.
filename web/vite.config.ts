import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: here,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(here, "../dist/web"),
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    // `npm run dev` (wrangler) serves the API on :8787; `npm run dev:web` proxies to it for HMR.
    proxy: { "/api": { target: "http://localhost:8787", changeOrigin: false } },
  },
});
