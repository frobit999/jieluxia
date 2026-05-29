# Relapse Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-stage relapse/reset flow so users can record a relapse, reset the current streak, and keep useful history.

**Architecture:** Add a dedicated `relapses` table and API route, keep relapse analytics in a small pure library, and surface the flow from the dashboard plus records page. Streak calculations stay date-based but exclude check-ins on or before the latest relapse date for current streak while preserving all historical check-ins.

**Tech Stack:** Next.js 15 App Router, Cloudflare D1 raw SQL, TypeScript, React client components, `node --test` via `tsx`.

---

### Task 1: Relapse Domain Logic

**Files:**
- Create: `src/lib/relapse.ts`
- Create: `src/lib/relapse.test.ts`
- Modify: `package.json`

- [ ] Write failing tests for filtering current-streak dates after latest relapse and summarizing relapse trigger counts.
- [ ] Run `npx tsx --test src/lib/relapse.test.ts` and confirm the tests fail because `src/lib/relapse.ts` does not exist.
- [ ] Implement `getDatesAfterLatestRelapse()` and `summarizeRelapses()`.
- [ ] Re-run the same test command and confirm it passes.

### Task 2: Database and API

**Files:**
- Modify: `schema.sql`
- Modify: `src/lib/schema.ts`
- Create: `src/app/api/relapses/route.ts`
- Modify: `src/app/api/streak/route.ts`
- Modify: `src/app/api/profile/route.ts`

- [ ] Add a `relapses` table with user, date, trigger, mood, note, and created timestamp fields.
- [ ] Add `GET /api/relapses` for recent relapses and summary.
- [ ] Add `POST /api/relapses` to record a relapse and return recalculated streak.
- [ ] Update streak/profile calculations to use dates after the latest relapse for current streak.

### Task 3: User Interface

**Files:**
- Create: `src/components/RelapseResetButton.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/(app)/records/page.tsx`

- [ ] Add a dashboard reset button with a bottom-sheet form for date, trigger, mood, and note.
- [ ] Refresh dashboard streak data after a relapse is recorded.
- [ ] Add a records page relapse summary section showing total relapses, latest relapse, and top triggers.

### Task 4: Verification and Delivery

**Files:**
- Modify as needed based on verification failures.

- [ ] Run `npx tsx --test src/lib/relapse.test.ts`.
- [ ] Run `npm run build`.
- [ ] Commit changes.
- [ ] Push branch `codex/relapse-reset`.
