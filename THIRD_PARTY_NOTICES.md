# Third-Party Notices

JobFlow uses the following open-source packages as **dependencies** (not copied source). Each remains under its own licence; full licence texts ship inside `node_modules/<package>/LICENSE` and are included in any distributed bundle as required.

## Runtime dependencies

| Package                                                     | Licence    | Purpose                              |
| ----------------------------------------------------------- | ---------- | ------------------------------------ |
| [hono](https://github.com/honojs/hono)                      | MIT        | HTTP routing & middleware on Workers |
| [@hono/zod-validator](https://github.com/honojs/middleware) | MIT        | Request validation                   |
| [zod](https://github.com/colinhacks/zod)                    | MIT        | Schema validation                    |
| [drizzle-orm](https://github.com/drizzle-team/drizzle-orm)  | Apache-2.0 | Typed D1 queries                     |
| [arctic](https://github.com/pilcrowonpaper/arctic)          | MIT        | Google OAuth 2.0 + PKCE client       |
| [react](https://github.com/facebook/react), react-dom       | MIT        | UI                                   |
| [react-router](https://github.com/remix-run/react-router)   | MIT        | Client routing                       |
| [@tanstack/react-query](https://github.com/TanStack/query)  | MIT        | Data fetching/cache                  |

## Build & test tooling (not shipped to users)

wrangler, @cloudflare/vitest-plugin, @cloudflare/workers-types (MIT OR Apache-2.0) · vite, vitest, @vitejs/plugin-react (MIT) · tailwindcss, @tailwindcss/vite (MIT) · typescript, @playwright/test (Apache-2.0) · eslint, typescript-eslint, eslint-plugin-react-hooks, prettier, jsdom, @testing-library/react, globals (MIT).

## Adapted code

None yet. Phase 4+ will adapt permissively licensed patterns identified in `docs/research/repository-comparison-matrix.md` (e.g. ATS endpoint knowledge from `kalil0321/ats-scrapers`, MIT). Every adaptation will be listed here with repository, commit SHA, licence and affected files, and original copyright headers will be preserved.

## Data

None yet. Company/source lists reused later (e.g. `remoteintech/remote-jobs`, ISC; `emredurukn/awesome-job-boards`, CC0) will be attributed here.
