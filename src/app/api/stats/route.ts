import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const range = searchParams.get("range") || "week";
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  if (range === "week") {
    const labels = ["一", "二", "三", "四", "五", "六", "日"];
    const dow = today.getDay();
    const mon = new Date(today);
    mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      const c = await db
        .prepare("SELECT id FROM checkins WHERE user_id=? AND checked_at=?")
        .bind(user.id, ds)
        .first();
      week.push({ day: labels[i], value: c ? 85 : 15 });
    }
    return NextResponse.json({ weekly: week });
  }

  const month =
    searchParams.get("month") || todayStr.slice(0, 7);
  const r = await db
    .prepare(
      "SELECT checked_at FROM checkins WHERE user_id=? AND checked_at LIKE ?"
    )
    .bind(user.id, `${month}%`)
    .all();
  const active = await db
    .prepare(
      "SELECT COUNT(DISTINCT user_id) as c FROM checkins WHERE checked_at=?"
    )
    .bind(todayStr)
    .first();
  return NextResponse.json({
    checkins: r.results.map((x: Record<string, unknown>) => x.checked_at),
    activeCount: (active?.c as number) || 0,
  });
}
