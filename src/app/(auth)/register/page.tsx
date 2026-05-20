"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { GlassCard } from "@/components/ui/GlassCard";
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
    } catch (err: any) {
      setError(err.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 10% 20%, #0d2d4a 0%, #081828 50%, #050f1a 100%)",
      }}
    >
      <GlowOrb x="-100px" y="-80px" color="#1a5fa0" size="500px" />
      <GlowOrb x="60%" y="40%" color="#0d3f6e" size="400px" />

      <GlassCard strong className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-[#e0f0ff] m-0">加入戒撸侠</h1>
          <p className="text-sm text-[rgba(180,210,255,0.5)] mt-1">
            开始你的自律之旅
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-[rgba(180,210,255,0.6)] mb-1.5 font-medium">
              昵称
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="给自己取个名字"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#e0f0ff] text-sm outline-none focus:border-[#4ab8ff] transition-colors placeholder:text-[rgba(180,210,255,0.3)]"
            />
          </div>

          <div>
            <label className="block text-xs text-[rgba(180,210,255,0.6)] mb-1.5 font-medium">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#e0f0ff] text-sm outline-none focus:border-[#4ab8ff] transition-colors placeholder:text-[rgba(180,210,255,0.3)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-[rgba(180,210,255,0.6)] mb-1.5 font-medium">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少6位"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#e0f0ff] text-sm outline-none focus:border-[#4ab8ff] transition-colors placeholder:text-[rgba(180,210,255,0.3)]"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
              {error}
            </div>
          )}

          <PrimaryButton className="w-full mt-2" disabled={loading}>
            {loading ? "注册中..." : "注册"}
          </PrimaryButton>
        </form>

        <div className="text-center mt-6 text-sm text-[rgba(180,210,255,0.5)]">
          已有账号？{" "}
          <Link
            href="/login"
            className="text-[#4ab8ff] no-underline hover:underline"
          >
            登录
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
