import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { calcStreak } from "@/lib/streak";
import { getDatesAfterLatestRelapse } from "@/lib/relapse";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const all = await db
    .prepare("SELECT DISTINCT date FROM checkins WHERE user_id=? AND habit_id='default'")
    .bind(user.id)
    .all();
  const relapses = await db
    .prepare("SELECT date FROM relapses WHERE user_id=?")
    .bind(user.id)
    .all();

  const checkinDates = all.results.map((r: Record<string, unknown>) => String(r.date));
  const relapseDates = relapses.results.map((r: Record<string, unknown>) => String(r.date));
  const current = calcStreak(getDatesAfterLatestRelapse(checkinDates, relapseDates)).current;
  const longest = calcStreak(checkinDates).longest;

  return NextResponse.json({ current, longest });
}
