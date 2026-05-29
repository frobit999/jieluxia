import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser, genId } from "@/lib/auth";
import { calcStreak } from "@/lib/streak";
import { getDatesAfterLatestRelapse, summarizeRelapses } from "@/lib/relapse";

function utcToday(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const rows = await db
    .prepare(
      "SELECT id,date,trigger,mood,note,created_at FROM relapses WHERE user_id=? ORDER BY date DESC, created_at DESC LIMIT 50"
    )
    .bind(user.id)
    .all();

  const relapses = rows.results.map((r: Record<string, unknown>) => ({
    id: String(r.id),
    date: String(r.date),
    trigger: String(r.trigger ?? ""),
    mood: String(r.mood ?? ""),
    note: r.note ? String(r.note) : "",
    createdAt: String(r.created_at ?? ""),
  }));

  return NextResponse.json({
    relapses,
    summary: summarizeRelapses(relapses),
  });
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const date = cleanText(body.date, 10) || utcToday();
  if (!isDateString(date)) {
    return NextResponse.json({ error: "日期格式不正确" }, { status: 400 });
  }

  const id = genId();
  const trigger = cleanText(body.trigger, 40);
  const mood = cleanText(body.mood, 40);
  const note = cleanText(body.note, 500);

  await db
    .prepare(
      "INSERT INTO relapses(id,user_id,date,trigger,mood,note) VALUES(?,?,?,?,?,?)"
    )
    .bind(id, user.id, date, trigger, mood, note || null)
    .run();

  const checkinRows = await db
    .prepare("SELECT DISTINCT date FROM checkins WHERE user_id=? AND habit_id='default'")
    .bind(user.id)
    .all();
  const relapseRows = await db
    .prepare("SELECT date FROM relapses WHERE user_id=?")
    .bind(user.id)
    .all();

  const checkinDates = checkinRows.results.map((r: Record<string, unknown>) => String(r.date));
  const relapseDates = relapseRows.results.map((r: Record<string, unknown>) => String(r.date));
  const currentDates = getDatesAfterLatestRelapse(checkinDates, relapseDates);

  return NextResponse.json({
    relapse: { id, date, trigger, mood, note },
    streak: {
      current: calcStreak(currentDates).current,
      longest: calcStreak(checkinDates).longest,
    },
  });
}
