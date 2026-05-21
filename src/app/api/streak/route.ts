import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { calcStreak } from "@/lib/streak";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const all = await db
    .prepare("SELECT checked_at FROM checkins WHERE user_id=?")
    .bind(user.id)
    .all();
  return NextResponse.json(
    calcStreak(all.results.map((r: Record<string, unknown>) => r.checked_at as string))
  );
}
