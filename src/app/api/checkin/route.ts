import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser, genId } from "@/lib/auth";
import { calcStreak, getLevel } from "@/lib/streak";

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const now = new Date();
  const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
  const exist = await db
    .prepare("SELECT id FROM checkins WHERE user_id=? AND checked_at=?")
    .bind(user.id, today)
    .first();
  if (exist) {
    return NextResponse.json({ error: "今日已打卡" }, { status: 400 });
  }

  const id = genId();
  const body = (await request.json().catch(() => ({}))) as { note?: string };
  await db
    .prepare(
      "INSERT INTO checkins(id,user_id,checked_at,note) VALUES(?,?,?,?)"
    )
    .bind(id, user.id, today, body.note || null)
    .run();

  const all = await db
    .prepare("SELECT checked_at FROM checkins WHERE user_id=?")
    .bind(user.id)
    .all();
  const dates = all.results.map((r: Record<string, unknown>) => r.checked_at as string);
  const { longest } = calcStreak(dates);
  const { level, title } = getLevel(longest);
  await db
    .prepare(
      "UPDATE users SET level=?,title=?,updated_at=datetime('now') WHERE id=?"
    )
    .bind(level, title, user.id)
    .run();

  return NextResponse.json({
    checkin: { id, checkedAt: today },
    streak: calcStreak([...dates, today]).current,
  });
}

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const month = searchParams.get("month");
  let q = "SELECT * FROM checkins WHERE user_id=?";
  const params: unknown[] = [user.id];
  if (month) {
    q += " AND checked_at LIKE ?";
    params.push(`${month}%`);
  }
  q += " ORDER BY checked_at DESC";

  const r = await db
    .prepare(q)
    .bind(...params)
    .all();
  return NextResponse.json({ checkins: r.results });
}
