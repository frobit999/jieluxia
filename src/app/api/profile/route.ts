import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { calcStreak } from "@/lib/streak";
import { getDatesAfterLatestRelapse } from "@/lib/relapse";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const all = await db
    .prepare("SELECT DISTINCT date FROM checkins WHERE user_id=? AND habit_id='default'")
    .bind(user.id)
    .all();
  const relapses = await db
    .prepare("SELECT date FROM relapses WHERE user_id=?")
    .bind(user.id)
    .all();
  const checkinDates = all.results.map((r: Record<string, unknown>) => String(r.date));
  const relapseDates = relapses.results.map((r: Record<string, unknown>) => String(r.date));
  const current = calcStreak(getDatesAfterLatestRelapse(checkinDates, relapseDates)).current;
  const longest = calcStreak(checkinDates).longest;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatarEmoji: user.avatar_emoji,
      level: user.level,
      title: user.title,
    },
    stats: { current, longest, totalCheckins: all.results.length },
  });
}

export async function PUT(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { nickname, avatarEmoji } = (await request.json()) as { nickname?: string; avatarEmoji?: string };
  if (nickname !== undefined) {
    const n = nickname.trim();
    if (!n || n.length > 20) {
      return NextResponse.json({ error: "昵称需1-20个字符" }, { status: 400 });
    }
    await db
      .prepare("UPDATE users SET nickname=?,updated_at=datetime('now') WHERE id=?")
      .bind(n, user.id)
      .run();
  }
  if (avatarEmoji) {
    await db
      .prepare(
        "UPDATE users SET avatar_emoji=?,updated_at=datetime('now') WHERE id=?"
      )
      .bind(avatarEmoji, user.id)
      .run();
  }

  const u = await db
    .prepare("SELECT * FROM users WHERE id=?")
    .bind(user.id)
    .first();
  return NextResponse.json({
    user: {
      id: u!.id,
      email: u!.email,
      nickname: u!.nickname,
      avatarEmoji: u!.avatar_emoji,
      level: u!.level,
      title: u!.title,
    },
  });
}
