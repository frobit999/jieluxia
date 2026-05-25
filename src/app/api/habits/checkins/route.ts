import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser, genId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const date = request.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  const rows = await db
    .prepare("SELECT id, habit_id, value, note, checked_at FROM checkins WHERE user_id=? AND date=?")
    .bind(user.id, date)
    .all();
  return NextResponse.json(rows.results);
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as { habit_id: string; date: string; value?: number; note?: string };
  if (!body.habit_id || !body.date) {
    return NextResponse.json({ error: "habit_id and date required" }, { status: 400 });
  }

  const id = genId();
  const value = typeof body.value === "number" ? body.value : 1;
  await db
    .prepare("INSERT INTO checkins(id, user_id, habit_id, date, value, note) VALUES(?,?,?,?,?,?)")
    .bind(id, user.id, body.habit_id, body.date, value, body.note || null)
    .run();
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as { id: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db
    .prepare("DELETE FROM checkins WHERE user_id=? AND id=?")
    .bind(user.id, body.id)
    .run();
  return NextResponse.json({ ok: true });
}
