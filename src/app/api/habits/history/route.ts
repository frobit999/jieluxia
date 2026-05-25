import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const rows = await db
    .prepare("SELECT date, COUNT(*) as count FROM checkins WHERE user_id=? GROUP BY date ORDER BY date DESC LIMIT 365")
    .bind(user.id)
    .all();
  return NextResponse.json(rows.results);
}
