<!-- refreshed: 2026-05-22 -->
# Architecture

**Analysis Date:** 2026-05-22

## System Overview

```text
+-------------------------------------------------------------+
|                   Browser (React 18 SPA)                     |
|  src/app/(app)/dashboard   src/app/(auth)/login              |
|  src/app/(app)/records     src/app/(auth)/register           |
|  src/app/(app)/community   src/app/(app)/settings            |
+-------------------------------------------------------------+
|              Custom Hooks (SWR-based data fetching)          |
|  src/hooks/useUser.ts  src/hooks/useCheckIn.ts               |
|  src/hooks/useStreak.ts                                     |
+-------------------------------------------------------------+
|              API Client Layer (src/lib/api.ts)               |
|  apiGet / apiPost / apiPut / apiFetch                        |
+-------------------+-----------------------------------------+
|  Next.js          |  Middleware (src/middleware.ts)           |
|  App Router       |  Route-level auth check                  |
|  API Routes       |  Cookie-based JWT redirect               |
|  src/app/api/     |                                          |
+-------------------+-----------------------------------------+
|  Auth Layer       |  Database Layer                           |
|  src/lib/auth.ts  |  src/lib/db.ts                           |
|  JWT + PBKDF2     |  Cloudflare D1 (SQLite)                  |
|  src/lib/streak.ts|  drizzle-orm schema                      |
+-------------------------------------------------------------+
|              Cloudflare Pages + Workers Runtime              |
|  wrangler.toml  OpenNext adapter  D1 Database                |
+-------------------------------------------------------------+
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root Layout | Font loading, global CSS, metadata | `src/app/layout.tsx` |
| App Layout | Sidebar, bottom nav, glow decorations | `src/app/(app)/layout.tsx` |
| Auth Layout | (none - bare pages) | `src/app/(auth)/login/page.tsx` |
| Middleware | Auth gating, public path redirect | `src/middleware.ts` |
| DB Access | D1 database + JWT secret retrieval | `src/lib/db.ts` |
| Auth Module | Password hashing, JWT sign/verify, user lookup | `src/lib/auth.ts` |
| Schema | Drizzle ORM table definitions (SQLite dialect) | `src/lib/schema.ts` |
| Streak Logic | Streak calculation and level progression | `src/lib/streak.ts` |
| API Client | Typed fetch wrappers with cookie credentials | `src/lib/api.ts` |

## Pattern Overview

**Overall:** Next.js App Router with API Routes — full-stack monolith on Cloudflare edge.

**Key Characteristics:**
- Route Groups `(app)` and `(auth)` separate authenticated from public pages
- Each page is a `"use client"` component that fetches data via `useEffect` + manual `apiGet` calls (no shared client-side state manager)
- API routes use raw D1 prepared statements (no ORM at runtime; Drizzle is used only for schema definition and migrations)
- Authentication is JWT-based with tokens stored in `httpOnly; secure` cookies
- Middleware handles page-level auth redirects; API routes handle auth internally (middleware skips `/api`)

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Location: `src/app/`, `src/components/`
- Contains: Next.js pages, reusable UI components (`src/components/ui/`)
- Depends on: Hooks, API client
- Used by: Browser

**Client Data Layer:**
- Purpose: Client-side data fetching and state
- Location: `src/hooks/`, `src/lib/api.ts`
- Contains: SWR hooks, typed fetch helpers
- Depends on: API routes
- Used by: Pages and components

**API Route Layer:**
- Purpose: Request handling, validation, business logic
- Location: `src/app/api/`
- Contains: REST endpoints for auth, checkin, community, stats, profile, streak
- Depends on: Auth lib, DB access, streak lib
- Used by: Client data layer

**Lib Layer:**
- Purpose: Shared server-side utilities
- Location: `src/lib/`
- Contains: DB access, auth (JWT + password hashing), schema definitions, streak math, quotes
- Depends on: Cloudflare runtime APIs (`crypto.subtle`, `getCloudflareContext`)
- Used by: API routes

**Infrastructure Layer:**
- Purpose: Cloudflare deployment and runtime
- Location: `wrangler.toml`, `open-next.config.ts`, `scripts/`
- Contains: D1 database binding, OpenNext adapter config, build/deploy scripts
- Used by: Everything at runtime

## Data Flow

### Primary Request Path (Dashboard Load)

1. Browser requests `/dashboard` — middleware checks `token` cookie (`src/middleware.ts:4`)
2. If no token, redirect to `/login`; if token present, serve page
3. Client component mounts, fires parallel API calls (`src/app/(app)/dashboard/page.tsx:35-42`):
   - `GET /api/auth/me` — `src/app/api/auth/me/route.ts` reads JWT from cookie, queries D1
   - `GET /api/streak` — `src/app/api/streak/route.ts` queries checkins, calls `calcStreak()`
   - `GET /api/checkin/today` — `src/app/api/checkin/today/route.ts` checks today's checkin
   - `GET /api/stats?range=week` — `src/app/api/stats/route.ts` queries 7 days of checkins
4. Each API route: `getDB()` -> `getUser(db, req, secret)` -> D1 query -> JSON response
5. Client renders state

### Check-In Flow

1. User clicks CheckInButton -> `apiPost("/api/checkin")` (`src/app/(app)/dashboard/page.tsx:63`)
2. `POST /api/checkin` handler (`src/app/api/checkin/route.ts`):
   - Verify user via JWT cookie
   - Check for existing checkin today
   - Insert checkin record
   - Recalculate streak and update user level/title via `getLevel()`
3. Client updates local state (`setCheckedIn(true)`, `setStreak(data.streak)`)

### Auth Flow (Login)

1. User submits form -> `apiPost("/api/auth/login", { email, password })` (`src/app/(auth)/login/page.tsx:24`)
2. `POST /api/auth/login` handler (`src/app/api/auth/login/route.ts`):
   - Lookup user by email in D1
   - Verify password with PBKDF2
   - Sign JWT with `signToken()`
   - Set `token` cookie (httpOnly, secure, 30 days)
   - Return user data
3. Client navigates to `/dashboard`

**State Management:**
- No centralized state store (no Redux, Zustand, etc.)
- Each page manages its own state via `useState` + `useEffect` data fetching
- Three SWR hooks exist (`useUser`, `useCheckIn`, `useStreak`) but are NOT used by the actual pages — pages use direct `apiGet` calls instead. The hooks are unused dead code.

## Key Abstractions

**Cloudflare D1 Database:**
- Purpose: SQLite-compatible serverless database
- Access pattern: `getDB()` returns D1 binding, raw SQL via `.prepare().bind().first()/.all()/.run()`
- Examples: `src/lib/db.ts:3-5`, all `src/app/api/*/route.ts` files

**JWT Authentication:**
- Purpose: Stateless user authentication via signed tokens
- Implementation: Custom JWT with Web Crypto API (HS256), 30-day expiry
- Token stored in `token` cookie, read in middleware and API routes
- Examples: `src/lib/auth.ts:66-120`, `src/middleware.ts:4`

**PBKDF2 Password Hashing:**
- Purpose: Secure password storage
- Implementation: 100k iterations, SHA-256, random 16-byte salt
- Examples: `src/lib/auth.ts:5-51`

**Glass Morphism UI Components:**
- Purpose: Visual consistency across the app
- Components: `GlassCard`, `GlowOrb`, `BottomSheet`, `PrimaryButton`, `ProgressBar`
- CSS utilities: `.glass-card`, `.glass-strong`, `.glass-pill` in `src/app/globals.css`
- Examples: `src/components/ui/GlassCard.tsx`, `src/components/ui/Button.tsx`

## Entry Points

**Application Entry:**
- Location: `src/app/page.tsx` — redirects to `/dashboard`
- Root layout: `src/app/layout.tsx` — fonts and global CSS
- App layout: `src/app/(app)/layout.tsx` — sidebar, bottom nav, background

**API Entry:**
- Auth: `src/app/api/auth/login/route.ts`, `register/route.ts`, `me/route.ts`, `logout/route.ts`
- Checkin: `src/app/api/checkin/route.ts`, `checkin/today/route.ts`
- Community: `src/app/api/community/route.ts`, `community/[id]/like/route.ts`
- Stats: `src/app/api/stats/route.ts`
- Profile: `src/app/api/profile/route.ts`
- Streak: `src/app/api/streak/route.ts`

**Middleware:**
- Location: `src/middleware.ts` — page-level auth gating

## Architectural Constraints

- **Runtime:** Cloudflare Workers edge runtime — no Node.js built-ins like `fs`, `path` at API runtime. Must use Web Crypto API (not Node crypto).
- **Database:** Cloudflare D1 — SQLite-compatible but not full SQLite. No joins across databases. Limited to D1's query interface.
- **No ORM at runtime:** Drizzle schema exists (`src/lib/schema.ts`) but API routes use raw D1 prepared statements exclusively. Drizzle migrations are generated but the migration directory `drizzle/migrations/` is empty.
- **Client components:** Every page is `"use client"` — no server components for data fetching. This means all data loading happens after hydration.
- **No shared client state:** Pages independently fetch data. The SWR hooks in `src/hooks/` are defined but unused by pages.

## Anti-Patterns

### N+1 Query in Community

**What happens:** The community list endpoint fetches all posts, then runs a separate `SELECT COUNT(*) FROM post_likes WHERE post_id=?` query for EACH post to get like counts (`src/app/api/community/route.ts:25-41`).

**Why it's wrong:** With 20 posts per page, this makes 21 database queries (1 for posts + 20 for like counts). D1 charges per query.

**Do this instead:** Use a subquery or LEFT JOIN with GROUP BY to get like counts in a single query.

### Duplicate Auth Checks

**What happens:** Every API route manually calls `getUser()` and returns 401 if null. This pattern is copy-pasted across all 9 route handlers.

**Why it's wrong:** Violates DRY, makes it easy to forget the check in new routes.

**Do this instead:** Create a wrapper function like `withAuth(handler)` that performs auth and injects the user object.

### Unused SWR Hooks

**What happens:** Three hooks exist (`useUser`, `useCheckIn`, `useStreak`) that wrap API calls with SWR. However, every page instead uses raw `apiGet`/`apiPost` with `useState`/`useEffect`.

**Why it's wrong:** Dead code increases confusion and maintenance burden. The SWR hooks provide caching and revalidation benefits that the pages are missing.

### No Server Components Used

**What happens:** Every page is marked `"use client"` and fetches data in `useEffect`. This is effectively treating Next.js as a client-side SPA.

**Why it's wrong:** Loses Next.js App Router benefits — no server-side rendering of data, no streaming, flash of loading state on every page load.

---

*Architecture analysis: 2026-05-22*
