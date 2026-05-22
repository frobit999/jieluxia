# Codebase Structure

**Analysis Date:** 2026-05-22

## Directory Layout

```
jieluxia/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, CSS, metadata)
│   │   ├── page.tsx                # Root page (redirects to /dashboard)
│   │   ├── globals.css             # Tailwind + glass-morphism CSS vars
│   │   ├── favicon.ico
│   │   ├── (app)/                  # Authenticated route group
│   │   │   ├── layout.tsx          # App shell: sidebar + bottom nav + glow orbs
│   │   │   ├── dashboard/page.tsx  # Main dashboard with streak, chart, checkin
│   │   │   ├── records/page.tsx    # Monthly calendar + body metrics
│   │   │   ├── community/page.tsx  # Social feed with posts and likes
│   │   │   └── settings/page.tsx   # Profile edit + logout
│   │   ├── (auth)/                 # Public route group
│   │   │   ├── login/page.tsx      # Email/password login form
│   │   │   └── register/page.tsx   # Registration form
│   │   └── api/                    # API route handlers
│   │       ├── auth/
│   │       │   ├── login/route.ts      # POST: login with email/password
│   │       │   ├── register/route.ts   # POST: create account
│   │       │   ├── me/route.ts         # GET: current user info
│   │       │   └── logout/route.ts     # POST: clear cookie
│   │       ├── checkin/
│   │       │   ├── route.ts            # POST: check in, GET: list checkins
│   │       │   └── today/route.ts      # GET: today's checkin status
│   │       ├── community/
│   │       │   ├── route.ts            # GET: paginated posts, POST: create post
│   │       │   └── [id]/like/route.ts  # POST: toggle like on post
│   │       ├── profile/
│   │       │   └── route.ts            # GET: profile+stats, PUT: update profile
│   │       ├── stats/
│   │       │   └── route.ts            # GET: weekly or monthly stats
│   │       └── streak/
│   │           └── route.ts            # GET: current and longest streak
│   ├── components/
│   │   ├── BenefitGrid.tsx         # Benefit milestones grid display
│   │   ├── BottomNav.tsx           # Mobile bottom navigation bar
│   │   ├── CheckInButton.tsx       # Animated daily check-in button
│   │   ├── CommunityPost.tsx       # Single community post card
│   │   ├── MilestoneBar.tsx        # Progress bar for streak milestones
│   │   ├── MonthlyCalendar.tsx     # Calendar grid showing checkin days
│   │   ├── QuoteCard.tsx           # Daily motivational quote display
│   │   ├── Sidebar.tsx             # Desktop sidebar navigation
│   │   ├── StreakRing.tsx          # Circular streak day indicator
│   │   ├── WeeklyChart.tsx         # Bar chart for weekly discipline index
│   │   └── ui/                     # Reusable UI primitives
│   │       ├── BackgroundLayout.tsx
│   │       ├── BottomSheet.tsx
│   │       ├── Button.tsx
│   │       ├── GlassCard.tsx
│   │       ├── GlowOrb.tsx
│   │       └── ProgressBar.tsx
│   ├── hooks/                      # SWR-based data hooks (defined but unused)
│   │   ├── useCheckIn.ts
│   │   ├── useStreak.ts
│   │   └── useUser.ts
│   ├── lib/                        # Core business logic
│   │   ├── api.ts                  # Typed API client (apiGet/apiPost/apiPut)
│   │   ├── auth.ts                 # JWT + PBKDF2 + user lookup
│   │   ├── db.ts                   # D1 + JWT secret accessors
│   │   ├── quotes.ts               # Motivational quotes array + daily selector
│   │   ├── schema.ts               # Drizzle ORM table definitions
│   │   └── streak.ts               # Streak calculation + level progression
│   ├── middleware.ts               # Auth redirect middleware
│   └── types/
│       └── cloudflare-env.d.ts     # CloudflareEnv type declaration
├── scripts/
│   ├── copy-assets.mjs             # Build helper (copies assets)
│   └── gen-routes.mjs              # Generates Cloudflare _routes.json
├── drizzle/
│   └── migrations/                 # Drizzle migration output (empty)
├── public/                         # Static assets
├── docs/                           # Documentation (untracked)
├── package.json
├── tsconfig.json
├── next.config.ts                  # Next.js config + OpenNext dev init
├── open-next.config.ts             # OpenNext Cloudflare adapter config
├── drizzle.config.ts               # Drizzle Kit config (SQLite, local.db)
├── wrangler.toml                   # Cloudflare Pages config + D1 binding
├── schema.sql                      # Manual SQL schema reference
├── postcss.config.mjs              # PostCSS with Tailwind v4
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
└── README.md
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components, API route handlers, layouts
- Key files: `layout.tsx` (root), `(app)/layout.tsx` (authenticated shell), `api/*/route.ts` (endpoints)

**`src/components/`:**
- Purpose: Reusable UI components for the check-in application
- Contains: Feature components (StreakRing, CheckInButton, etc.) and UI primitives
- Key files: `Sidebar.tsx`, `CheckInButton.tsx`, `StreakRing.tsx`

**`src/components/ui/`:**
- Purpose: Low-level design system components
- Contains: Glass morphism cards, buttons, glow effects, progress bars
- Key files: `GlassCard.tsx`, `Button.tsx`, `GlowOrb.tsx`

**`src/hooks/`:**
- Purpose: SWR-based data fetching hooks (currently unused dead code)
- Contains: `useUser.ts`, `useCheckIn.ts`, `useStreak.ts`
- Note: Pages use direct `apiGet` calls instead of these hooks

**`src/lib/`:**
- Purpose: Core server/client utilities and business logic
- Contains: Auth (JWT/PBKDF2), DB access, API client, streak math, schema
- Key files: `auth.ts`, `db.ts`, `api.ts`, `streak.ts`, `schema.ts`

**`scripts/`:**
- Purpose: Cloudflare Pages build/deploy helpers
- Contains: Asset copying and route JSON generation scripts

**`drizzle/`:**
- Purpose: Drizzle ORM migration output directory
- Contains: `migrations/` (currently empty)
- Generated: Yes (by `drizzle-kit generate`)

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Root page, redirects to `/dashboard`
- `src/app/(app)/layout.tsx`: Authenticated app shell with sidebar and bottom nav
- `src/middleware.ts`: Auth gating for page routes

**Configuration:**
- `package.json`: Dependencies, scripts (`dev`, `build`, `cf:build`, `cf:deploy`)
- `next.config.ts`: Next.js config with OpenNext Cloudflare dev adapter
- `open-next.config.ts`: OpenNext adapter settings (edge runtime, dummy caches)
- `wrangler.toml`: Cloudflare Pages config, D1 database binding, JWT_SECRET
- `drizzle.config.ts`: Drizzle Kit config pointing to `src/lib/schema.ts`
- `tsconfig.json`: TypeScript config with `@/*` path alias to `./src/*`

**Core Logic:**
- `src/lib/auth.ts`: Password hashing (PBKDF2), JWT sign/verify, user lookup from cookie
- `src/lib/db.ts`: `getDB()` and `getJWTSecret()` via Cloudflare context
- `src/lib/streak.ts`: `calcStreak()` and `getLevel()` for streak-to-level mapping
- `src/lib/api.ts`: Client-side fetch wrappers (`apiGet`, `apiPost`, `apiPut`)

**API Routes:**
- `src/app/api/auth/login/route.ts`: Email/password login
- `src/app/api/auth/register/route.ts`: Account creation
- `src/app/api/checkin/route.ts`: Create/list checkins
- `src/app/api/community/route.ts`: Paginated posts feed
- `src/app/api/stats/route.ts`: Weekly/monthly statistics
- `src/app/api/profile/route.ts`: User profile read/update

## Naming Conventions

**Files:**
- Pages and layouts: `page.tsx`, `layout.tsx` (Next.js App Router convention)
- API routes: `route.ts` (Next.js App Router convention)
- Components: PascalCase `.tsx` files (`StreakRing.tsx`, `GlassCard.tsx`)
- Hooks: `use` prefix camelCase `.ts` (`useUser.ts`, `useCheckIn.ts`)
- Library modules: camelCase `.ts` (`auth.ts`, `db.ts`, `streak.ts`)

**Directories:**
- Route groups: parenthesized `(app)`, `(auth)` — not part of URL path
- Dynamic segments: `[id]` for dynamic route params
- UI primitives: `components/ui/` subdirectory

## Where to Add New Code

**New Page (authenticated):**
- Create `src/app/(app)/yourpage/page.tsx`
- Add nav item to `src/components/Sidebar.tsx` (navItems array) and `src/components/BottomNav.tsx`

**New Page (public):**
- Create `src/app/(auth)/yourpage/page.tsx`

**New API Endpoint:**
- Create `src/app/api/<resource>/route.ts`
- Follow the pattern: import `getDB`/`getJWTSecret` from `@/lib/db`, import `getUser` from `@/lib/auth`, authenticate, query D1, return `NextResponse.json()`

**New UI Component:**
- Feature component: `src/components/YourComponent.tsx`
- Reusable primitive: `src/components/ui/YourPrimitive.tsx`

**New Business Logic:**
- Add to `src/lib/` as a new `.ts` module

**Database Schema Changes:**
- Edit `src/lib/schema.ts`
- Regenerate migrations with `npx drizzle-kit generate`
- Also update `schema.sql` if maintaining the manual SQL reference

---

*Structure analysis: 2026-05-22*
