# Code Conventions

**Analysis Date:** 2026-05-22

## Code Style

**Language:** TypeScript (strict mode via `tsconfig.json`)

**Formatting:**
- No ESLint, Prettier, or Biome configured
- Inconsistent formatting across files (some use semicolons, some don't)

**Naming Conventions:**
- Components: PascalCase (`GlassCard.tsx`, `CheckInButton.tsx`)
- Hooks: camelCase with `use` prefix (`useUser.ts`, `useCheckIn.ts`)
- Lib modules: camelCase (`auth.ts`, `streak.ts`, `db.ts`)
- API routes: Always `route.ts` inside resource directories (`api/checkin/route.ts`)
- Path alias: `@/*` maps to `./src/*`

## Export Patterns

- Named exports for components/hooks
- `export default` for page components only
- No barrel files (`index.ts` re-exports)

## Type Patterns

- Inline prop typing: `{ children: ReactNode; className?: string }`
- `interface` for complex shapes
- 7 instances of `any` type usage across dashboard, community, settings, records pages

## Error Handling

- API routes return `{ error: "Chinese message" }` with appropriate HTTP status
- No try/catch in most API routes — errors propagate as unhandled
- No error boundary components (`error.tsx`) in the app

## Component Patterns

**Client Components:**
- Marked with `"use client"` directive at file top
- Every page is a client component — no server components used for data fetching

**Data Fetching:**
- Pages use `useState` + `useEffect` + manual `apiGet` calls
- Three SWR hooks exist in `src/hooks/` but are unused by pages (dead code)
- No centralized state management (no Redux, Zustand, etc.)

**UI System:**
- Glass morphism design system with `GlassCard`, `GlowOrb`, `BottomSheet`, `PrimaryButton`, `ProgressBar`
- CSS utilities: `.glass-card`, `.glass-strong`, `.glass-pill` in `src/app/globals.css`
- Tailwind CSS v4 with PostCSS

## API Route Pattern

```typescript
// Typical API route structure
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  // ... business logic with raw D1 prepared statements
  const result = await db.prepare("SELECT ...").bind(user.id).first();
  return NextResponse.json(result);
}
```

## SQL Patterns

- Raw prepared statements via D1: `db.prepare("SELECT ...").bind(...).first()/.all()/.run()`
- Drizzle ORM schema defined in `src/lib/schema.ts` but NOT used for queries at runtime
- No query builder usage — all SQL is string-based

## Authentication Pattern

- JWT tokens stored in `httpOnly; secure` cookies (30-day expiry)
- Password hashing: PBKDF2 with 100k iterations, SHA-256, random 16-byte salt
- Every API route manually calls `getUser()` and returns 401 if null (duplicated across 9 routes)

## State Management

- No centralized store
- Each page independently fetches data
- Auth redirect logic duplicated in every page component (not in layout)

---

*Conventions analysis: 2026-05-22*
