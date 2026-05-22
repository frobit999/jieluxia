# Technology Stack

**Analysis Date:** 2026-05-22

## Languages

**Primary:**
- TypeScript 5.x - All application code (server API routes, client components, shared libs)
- SQL (via D1 prepared statements) - Direct database queries in API routes

**Secondary:**
- JavaScript - Build scripts (`scripts/copy-assets.mjs`, `scripts/gen-routes.mjs`)

## Runtime

**Environment:**
- Cloudflare Workers (via Pages) with `nodejs_compat` compatibility flag
- Node.js polyfilled at edge (not a traditional Node server)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 15.5.x - Full-stack React framework with App Router (`src/app/`)
  - NOTE: Uses OpenNext.js Cloudflare adapter (`@opennextjs/cloudflare`), NOT the standard Next.js server runtime
  - Referenced in `AGENTS.md`: "This is NOT the Next.js you know" -- breaking changes from standard Next.js

**Testing:**
- No test framework detected. No jest, vitest, playwright, or cypress configs found.

**Build/Dev:**
- OpenNext.js Cloudflare (`@opennextjs/cloudflare` v1.19.11) - Builds Next.js for Cloudflare Workers/Pages
- Wrangler v4.93.0 - Cloudflare CLI for local dev and deployment
- Tailwind CSS v4 - Utility-first CSS framework (via `@tailwindcss/postcss`)
- PostCSS - CSS processing (config: `postcss.config.mjs`)

## Key Dependencies

**Critical:**
- `next` 15.5.x - Application framework (App Router, API routes, SSR)
- `react` / `react-dom` 18.3.x - UI library
- `drizzle-orm` 0.45.x - Database ORM (schema definition in `src/lib/schema.ts`; raw SQL queries used at runtime)
- `jose` 6.2.x - JWT library (imported in `package.json` but NOT actually used -- custom JWT implementation in `src/lib/auth.ts` uses `crypto.subtle` directly)
- `swr` 2.4.x - Client-side data fetching with caching (used in `src/hooks/useUser.ts`, `src/hooks/useCheckIn.ts`, `src/hooks/useStreak.ts`)

**Infrastructure:**
- `@opennextjs/cloudflare` 1.19.11 - Next.js-to-Cloudflare adapter (provides `getCloudflareContext()`, edge wrappers)
- `better-sqlite3` 12.10.x - SQLite driver (listed as dependency but NOT used in code; D1 is the actual database)
- `nanoid` 5.1.x - ID generation library (imported but NOT used; custom `genId()` in `src/lib/auth.ts` uses `crypto.randomUUID()`)
- `@cloudflare/workers-types` (devDep) - TypeScript types for D1, Workers API

**Utilities:**
- `drizzle-kit` 0.31.x - Drizzle migration tooling (config: `drizzle.config.ts`, targets SQLite dialect with `./local.db`)

## Configuration

**Environment:**
- Cloudflare environment variables set in `wrangler.toml`:
  - `JWT_SECRET` - JWT signing secret (currently set to `"change-this-in-production"`)
- Cloudflare D1 database binding: `DB` (database name `jieluxiad1`, ID in `wrangler.toml`)
- `.env` files: Not detected (all config via `wrangler.toml` and `CloudflareEnv` type declaration)

**Build:**
- `next.config.ts` - Minimal; in dev mode, initializes OpenNext Cloudflare dev runtime
- `open-next.config.ts` - OpenNext adapter config: edge mode, `cloudflare-node` wrapper, `dummy` caches
- `drizzle.config.ts` - Drizzle Kit config for SQLite migrations (schema at `src/lib/schema.ts`, output at `drizzle/migrations`)
- `wrangler.toml` - Cloudflare Workers config: D1 binding, `nodejs_compat` flag
- `tsconfig.json` - Target ES2017, bundler module resolution, `@/*` path alias to `src/*`

## Platform Requirements

**Development:**
- Node.js (version not pinned; no `.nvmrc` or `.python-version` detected)
- Wrangler CLI for local Cloudflare emulation

**Production:**
- Cloudflare Pages (deployment target)
- Build command: `npm run cf:build` (runs `opennextjs-cloudflare build`, then copies assets and generates routes)
- Deploy command: `npm run cf:deploy`
- Note: The `cf:build` script has a workaround to copy `_routes.json` into the assets directory

---

*Stack analysis: 2026-05-22*
