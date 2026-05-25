import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const rows = await db
    .prepare("SELECT id, name, icon, color, daily_target, unit, deadline, category, goal_type, status, created_at, updated_at FROM custom_goals WHERE user_id=? ORDER BY status ASC, created_at DESC")
    .bind(user.id)
    .all();
  return NextResponse.json(rows.results);
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as {
    name: string; icon?: string; color?: string; daily_target: number;
    unit?: string; deadline: string; category?: string; goal_type?: string;
  };
  if (!body.name || !body.daily_target || !body.deadline) {
    return NextResponse.json({ error: "name, daily_target, deadline required" }, { status: 400 });
  }

  const result = await db
    .prepare("INSERT INTO custom_goals(user_id, name, icon, color, daily_target, unit, deadline, category, goal_type) VALUES(?,?,?,?,?,?,?,?,?)")
    .bind(user.id, body.name, body.icon || "🎯", body.color || "#9cd6ee", body.daily_target, body.unit || "", body.deadline, body.category || "", body.goal_type || "continuous")
    .run();
  return NextResponse.json({ id: result.meta?.last_row_id, ok: true });
}

export async function PUT(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const fields: string[] = [];
  const values: unknown[] = [];
  for (const key of ["name", "icon", "color", "daily_target", "unit", "deadline", "status", "category", "goal_type"]) {
    if (body[key] !== undefined) {
      fields.push(`${key}=?`);
      values.push(body[key]);
    }
  }
  if (fields.length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  fields.push("updated_at=datetime('now')");
  values.push(body.id, user.id);

  await db
    .prepare(`UPDATE custom_goals SET ${fields.join(", ")} WHERE id=? AND user_id=?`)
    .bind(...values)
    .run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as { id: number };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Delete associated checkins first
  await db
    .prepare("DELETE FROM checkins WHERE user_id=? AND habit_id=?")
    .bind(user.id, `custom_${body.id}`)
    .run();
  await db
    .prepare("DELETE FROM custom_goals WHERE id=? AND user_id=?")
    .bind(body.id, user.id)
    .run();
  return NextResponse.json({ ok: true });
}
