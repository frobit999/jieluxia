import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = (await request.json()) as { id: string; note: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db
    .prepare("UPDATE checkins SET note=? WHERE user_id=? AND id=?")
    .bind(body.note || null, user.id, body.id)
    .run();
  return NextResponse.json({ ok: true });
}
