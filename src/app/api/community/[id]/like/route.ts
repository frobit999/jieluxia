import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDB();
  const secret = getJWTSecret();
  const user = await getUser(db, request, secret);
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id: postId } = await params;
  const exist = await db
    .prepare("SELECT * FROM post_likes WHERE post_id=? AND user_id=?")
    .bind(postId, user.id)
    .first();

  if (exist) {
    await db
      .prepare("DELETE FROM post_likes WHERE post_id=? AND user_id=?")
      .bind(postId, user.id)
      .run();
  } else {
    await db
      .prepare("INSERT INTO post_likes(post_id,user_id) VALUES(?,?)")
      .bind(postId, user.id)
      .run();
  }

  const lc = await db
    .prepare("SELECT COUNT(*) as c FROM post_likes WHERE post_id=?")
    .bind(postId)
    .first();
  return NextResponse.json({ liked: !exist, likeCount: (lc?.c as number) || 0 });
}
