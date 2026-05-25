import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const rows = await db
    .prepare("SELECT habit_id, target FROM user_goals WHERE user_id=?")
    .bind(user.id)
    .all();
  return NextResponse.json(rows.results);
}

export async function PUT(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as { goals: Record<string, number> };
  if (!body.goals || typeof body.goals !== "object") {
    return NextResponse.json({ error: "goals object required" }, { status: 400 });
  }

  for (const [habitId, target] of Object.entries(body.goals)) {
    if (typeof target !== "number") continue;
    await db
      .prepare(
        "INSERT INTO user_goals(user_id, habit_id, target) VALUES(?,?,?) ON CONFLICT(user_id, habit_id) DO UPDATE SET target=excluded.target"
      )
      .bind(user.id, habitId, target)
      .run();
  }
  return NextResponse.json({ ok: true });
}
