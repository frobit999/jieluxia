import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser, genId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = +(searchParams.get("page") || 1);
  const limit = +(searchParams.get("limit") || 20);
  const offset = (page - 1) * limit;

  const r = await db
    .prepare(
      "SELECT p.id, p.content, p.created_at, u.nickname, u.avatar_emoji, (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) as like_count FROM posts p LEFT JOIN users u ON p.user_id=u.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?"
    )
    .bind(limit, offset)
    .all();

  const posts = r.results.map((p: Record<string, unknown>) => ({
    id: p.id,
    content: p.content,
    createdAt: p.created_at,
    nickname: p.nickname || "匿名",
    avatarEmoji: p.avatar_emoji || "🛡️",
    likeCount: (p.like_count as number) || 0,
  }));

  const total = await db
    .prepare("SELECT COUNT(*) as c FROM posts")
    .first();
  return NextResponse.json({ posts, total: (total?.c as number) || 0 });
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { content } = (await request.json()) as { content: string };
  if (!content?.trim()) {
    return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
  }
  if (content.trim().length > 500) {
    return NextResponse.json({ error: "内容不能超过500字" }, { status: 400 });
  }

  const id = genId();
  await db
    .prepare("INSERT INTO posts(id,user_id,content) VALUES(?,?,?)")
    .bind(id, user.id, content.trim())
    .run();

  return NextResponse.json({
    post: {
      id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      nickname: user.nickname,
      avatarEmoji: user.avatar_emoji,
    },
  });
}
