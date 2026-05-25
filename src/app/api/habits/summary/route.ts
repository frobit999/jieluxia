import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const daysParam = request.nextUrl.searchParams.get("days") || "7";
  const days = Math.min(30, Math.max(1, parseInt(daysParam, 10)));

  const rows = await db
    .prepare(
      "SELECT habit_id, SUM(value) as total FROM checkins WHERE user_id=? AND date >= date('now', ? || ' days') GROUP BY habit_id"
    )
    .bind(user.id, `-${days - 1}`)
    .all();
  return NextResponse.json(rows.results);
}
