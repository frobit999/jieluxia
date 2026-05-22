import { NextRequest, NextResponse } from "next/server";
import { getDB, getJWTSecret } from "@/lib/db";
import { hashPassword, signToken, genId } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const db = getDB();
  const secret = getJWTSecret();
  const { email, password, nickname } = (await request.json()) as { email: string; password: string; nickname?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "密码至少8位" }, { status: 400 });
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return NextResponse.json({ error: "密码需包含字母和数字" }, { status: 400 });
  }

  const exists = await db
    .prepare("SELECT id FROM users WHERE email=?")
    .bind(email)
    .first();
  if (exists) {
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 400 });
  }

  const id = genId();
  await db
    .prepare(
      "INSERT INTO users(id,email,password_hash,nickname) VALUES(?,?,?,?)"
    )
    .bind(id, email, await hashPassword(password), nickname || "新人战士")
    .run();

  const token = await signToken(id, secret);
  const response = NextResponse.json({
    user: {
      id,
      email,
      nickname: nickname || "新人战士",
      avatarEmoji: "🛡️",
      level: 1,
      title: "新人",
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
