"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/Button";
import { apiPost } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiPost("/api/auth/register", { email, password, nickname });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-eggshell)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto mb-4"
            style={{ background: "var(--color-obsidian)" }}
          >
            <span style={{ color: "var(--color-eggshell)" }}>戒</span>
          </div>
          <h1
            className="text-[36px] m-0 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: "var(--color-obsidian)", letterSpacing: "-0.72px" }}
          >
            加入戒撸侠
          </h1>
          <p className="text-[14px] mt-2" style={{ color: "var(--color-gravel)" }}>
            开始你的自律之旅
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] mb-1.5 font-medium" style={{ color: "var(--color-gravel)" }}>
              昵称
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="给自己取个名字"
              className="w-full px-4 py-3 text-[14px] outline-none"
              style={{
                background: "#ffffff",
                border: "1px solid var(--color-chalk)",
                borderRadius: "4px",
                color: "var(--color-obsidian)",
              }}
            />
          </div>

          <div>
            <label className="block text-[12px] mb-1.5 font-medium" style={{ color: "var(--color-gravel)" }}>
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 text-[14px] outline-none"
              style={{
                background: "#ffffff",
                border: "1px solid var(--color-chalk)",
                borderRadius: "4px",
                color: "var(--color-obsidian)",
              }}
              required
            />
          </div>

          <div>
            <label className="block text-[12px] mb-1.5 font-medium" style={{ color: "var(--color-gravel)" }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少8位，含字母和数字"
              className="w-full px-4 py-3 text-[14px] outline-none"
              style={{
                background: "#ffffff",
                border: "1px solid var(--color-chalk)",
                borderRadius: "4px",
                color: "var(--color-obsidian)",
              }}
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="text-[13px] text-center py-2 rounded-lg" style={{ color: "var(--color-ember)", background: "rgba(255, 71, 4, 0.06)", border: "1px solid rgba(255, 71, 4, 0.15)" }}>
              {error}
            </div>
          )}

          <PrimaryButton className="w-full mt-2" disabled={loading}>
            {loading ? "注册中..." : "注册"}
          </PrimaryButton>
        </form>

        <div className="text-center mt-8 text-[14px]" style={{ color: "var(--color-gravel)" }}>
          已有账号？{" "}
          <Link
            href="/login"
            className="no-underline font-medium"
            style={{ color: "var(--color-obsidian)" }}
          >
            登录
          </Link>
        </div>
      </div>
    </div>
  );
}
