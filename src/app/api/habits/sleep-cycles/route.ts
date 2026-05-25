import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const date = request.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  const rows = await db
    .prepare("SELECT id, date, wake_time, sleep_time FROM sleep_cycles WHERE user_id=? AND date=? ORDER BY id ASC")
    .bind(user.id, date)
    .all();
  return NextResponse.json(rows.results);
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as { date: string; wake_time?: string; sleep_time?: string };
  if (!body.date) return NextResponse.json({ error: "date required" }, { status: 400 });
  if (!body.wake_time && !body.sleep_time) {
    return NextResponse.json({ error: "wake_time or sleep_time required" }, { status: 400 });
  }

  // Try to merge with existing incomplete cycle
  let existing = null;
  if (body.wake_time && !body.sleep_time) {
    existing = await db
      .prepare("SELECT id, wake_time, sleep_time FROM sleep_cycles WHERE user_id=? AND date=? AND wake_time IS NULL AND sleep_time IS NOT NULL ORDER BY id DESC LIMIT 1")
      .bind(user.id, body.date)
      .first();
  } else if (body.sleep_time && !body.wake_time) {
    existing = await db
      .prepare("SELECT id, wake_time, sleep_time FROM sleep_cycles WHERE user_id=? AND date=? AND wake_time IS NOT NULL AND sleep_time IS NULL ORDER BY id DESC LIMIT 1")
      .bind(user.id, body.date)
      .first();
  }

  if (existing) {
    const updates: string[] = [];
    const values: string[] = [];
    if (body.wake_time && !(existing as Record<string, unknown>).wake_time) {
      updates.push("wake_time=?");
      values.push(body.wake_time);
    }
    if (body.sleep_time && !(existing as Record<string, unknown>).sleep_time) {
      updates.push("sleep_time=?");
      values.push(body.sleep_time);
    }
    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }
    values.push(String((existing as Record<string, unknown>).id));
    await db
      .prepare(`UPDATE sleep_cycles SET ${updates.join(", ")} WHERE id=?`)
      .bind(...values)
      .run();
    return NextResponse.json({ id: (existing as Record<string, unknown>).id, ok: true, merged: true });
  }

  const result = await db
    .prepare("INSERT INTO sleep_cycles(user_id, date, wake_time, sleep_time) VALUES(?,?,?,?)")
    .bind(user.id, body.date, body.wake_time || null, body.sleep_time || null)
    .run();
  return NextResponse.json({ id: result.meta?.last_row_id, ok: true });
}

export async function PUT(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as { id: number; wake_time?: string; sleep_time?: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updates: string[] = [];
  const values: string[] = [];
  if (body.wake_time) { updates.push("wake_time=?"); values.push(body.wake_time); }
  if (body.sleep_time) { updates.push("sleep_time=?"); values.push(body.sleep_time); }
  if (updates.length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  values.push(String(body.id), String(user.id));
  await db
    .prepare(`UPDATE sleep_cycles SET ${updates.join(", ")} WHERE id=? AND user_id=?`)
    .bind(...values)
    .run();
  return NextResponse.json({ ok: true });
}
