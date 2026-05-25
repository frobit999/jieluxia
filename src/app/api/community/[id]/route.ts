import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const post = await db
    .prepare("SELECT user_id FROM posts WHERE id=?")
    .bind(id)
    .first();

  if (!post) {
    return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
  }
  if (post.user_id !== user.id) {
    return NextResponse.json({ error: "只能删除自己的帖子" }, { status: 403 });
  }

  await db.prepare("DELETE FROM post_likes WHERE post_id=?").bind(id).run();
  await db.prepare("DELETE FROM posts WHERE id=?").bind(id).run();

  return NextResponse.json({ ok: true });
}
