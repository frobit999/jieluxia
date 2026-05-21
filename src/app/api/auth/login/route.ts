import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const { email, password } = (await request.json()) as { email: string; password: string };

  if (!email || !password) {
    return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
  }

  const user = await db
    .prepare("SELECT * FROM users WHERE email=?")
    .bind(email)
    .first();
  if (!user || !(await verifyPassword(password, user.password_hash as string))) {
    return NextResponse.json({ error: "邮箱或密码错误" }, { status: 400 });
  }

  const token = await signToken(user.id as string, secret);
  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatarEmoji: user.avatar_emoji,
      level: user.level,
      title: user.title,
    },
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 2592000,
    path: "/",
  });
  return response;
}
