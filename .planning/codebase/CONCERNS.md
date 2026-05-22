# Codebase Concerns

**Analysis Date:** 2026-05-22

## Security

### JWT Secret Committed to Git
- **Risk:** High
- **Files:** `wrangler.toml` (line 12)
- **Details:** JWT secret is `"change-this-in-production"` committed directly. Database ID also exposed.
- **Fix:** Move to Cloudflare Pages encrypted secrets.

### Middleware Does Not Validate JWT
- **Risk:** High
- **Files:** `src/middleware.ts` (line 4)
- **Details:** Middleware only checks cookie existence, not JWT validity. Any cookie named `token` grants access.
- **Fix:** Verify JWT in middleware using the existing `jose` dependency or `src/lib/auth.ts` crypto.

### No CSRF Protection
- **Risk:** Medium
- **Files:** All `src/app/api/` routes
- **Details:** No origin validation, no CSRF tokens on POST/PUT endpoints.

### No Rate Limiting on Auth Endpoints
- **Risk:** Medium
- **Files:** `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`
- **Details:** Unlimited password guesses allowed.

### No Input Sanitization / Length Limit on Posts
- **Risk:** Medium
- **Files:** `src/app/api/community/route.ts` (line 58), `src/components/CommunityPost.tsx`
- **Details:** No max length on post content. No sanitization library.

### Weak Password Policy
- **Risk:** Low
- **Files:** `src/app/api/auth/register/route.ts` (line 13)
- **Details:** Only `password.length < 6` enforced.

### Nickname Update Has No Validation
- **Risk:** Low
- **Files:** `src/app/api/profile/route.ts` (lines 44-48)

## Tech Debt

### Zero Test Coverage
- **Risk:** High
- **Details:** No test files, no test runner, no test scripts. Start with `src/lib/streak.ts`.

### No Linting/Formatting Config
- **Risk:** Medium
- **Details:** No ESLint, Prettier, or Biome configured.

### Inconsistent Data Fetching Pattern
- **Risk:** Medium
- **Files:** `src/hooks/useUser.ts`, `src/hooks/useCheckIn.ts`, `src/hooks/useStreak.ts` exist but are only used in `Sidebar.tsx`. All pages do manual `apiGet("/api/auth/me")` calls instead.
- **Fix:** Centralize with an AuthProvider in `src/app/(app)/layout.tsx`.

### N+1 Query in Community Endpoint
- **Risk:** Medium
- **Files:** `src/app/api/community/route.ts` (lines 25-41)
- **Details:** 21 DB queries per page load (1 for posts + 20 for like counts).
- **Fix:** Single LEFT JOIN query.

### Full Table Scan for Streak Calculations
- **Risk:** Medium
- **Files:** `src/app/api/streak/route.ts` (line 15), `src/app/api/profile/route.ts` (line 15), `src/app/api/checkin/route.ts` (line 33)
- **Details:** Loads ALL checkins for a user. Store streak on `users` table instead.

### Seven Queries for Weekly Stats
- **Risk:** Low
- **Files:** `src/app/api/stats/route.ts` (lines 28-31)
- **Fix:** Single query with IN clause.

### `any` Type Usage (7 instances)
- **Risk:** Low
- **Files:** `src/app/(app)/dashboard/page.tsx`, `community/page.tsx`, `settings/page.tsx`, `records/page.tsx`

### Timezone Inconsistency
- **Risk:** Medium
- **Files:** `src/lib/streak.ts` (line 4), `src/app/api/checkin/route.ts` (line 14), `src/app/api/stats/route.ts` (line 16)
- **Details:** UTC dates from `toISOString()` but local `getDay()` causes wrong weekly chart labels for UTC+8 users.

### Build Log Committed
- **Files:** `jieluxia.production.6c948ee3-d71d-4890-b45c-fc46ffdd1f4f.build.log`

### README Is Boilerplate
- **Files:** `README.md` — references Vercel but project deploys to Cloudflare Pages.

## Performance Bottlenecks

### Community Page Full Refetch on Like
- **Files:** `src/app/(app)/community/page.tsx` (lines 72-75)
- **Details:** Entire post list refetched on each like. Use optimistic update from API response instead.

## Fragile Areas

### No Error Boundary
- **Details:** No `error.tsx` in `src/app/(app)/`. Unhandled React errors show default Next.js page.

### Auth Redirect Duplicated in Every Page
- **Files:** All four page files in `src/app/(app)/`
- **Details:** Each page independently checks auth and redirects. Layout at `src/app/(app)/layout.tsx` does no auth check.
- **Fix:** Move auth to layout or create AuthProvider.

### Streak Calculation DST Issue
- **Files:** `src/lib/streak.ts` (lines 4-5)
- **Details:** `Date.now() - 86400000` fails during DST transitions.

### D1 Type Assertions Unsafe
- **Files:** All `src/app/api/` routes
- **Details:** Raw SQL with `Record<string, unknown>` assertions. Drizzle schemas defined but not used in queries.

### Incomplete: Reply Button
- **Files:** `src/components/CommunityPost.tsx` (line 55) — no onClick handler.

### Incomplete: Settings Menu Items
- **Files:** `src/app/(app)/settings/page.tsx` (lines 142-146) — clickable but non-functional.

## Missing Critical Features

### No Error/Not-Found Pages
- **Details:** No `error.tsx` or `not-found.tsx` in the app.

### No Content Moderation
- **Files:** `src/app/api/community/route.ts`

### No Database Migration Strategy
- **Risk:** High
- **Files:** `drizzle.config.ts`, `schema.sql`
- **Details:** Two competing approaches (raw SQL + Drizzle). `drizzle/migrations` directory is empty. No D1 backup strategy documented.

---

*Concerns analysis: 2026-05-22*
