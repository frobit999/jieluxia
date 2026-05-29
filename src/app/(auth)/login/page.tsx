"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/Button";
import { apiPost } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiPost("/api/auth/login", { email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--color-eggshell)" }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "var(--color-obsidian)", marginBottom: "20px" }}
          >
            <span style={{ color: "var(--color-eggshell)", fontSize: "14px", fontWeight: 500 }}>戒</span>
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "36px",
              letterSpacing: "-0.72px",
              color: "var(--color-obsidian)",
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            岁月清风
          </h1>
          <p className="text-body">自律成就未来</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--color-gravel)", marginBottom: "6px", fontWeight: 500 }}>
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field"
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--color-gravel)", marginBottom: "6px", fontWeight: 500 }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="input-field"
              required
            />
          </div>

          {error && (
            <div
              style={{
                fontSize: "13px",
                textAlign: "center",
                padding: "10px 16px",
                marginBottom: "20px",
                borderRadius: "8px",
                color: "var(--color-ember)",
                background: "rgba(255, 71, 4, 0.05)",
                border: "1px solid rgba(255, 71, 4, 0.12)",
              }}
            >
              {error}
            </div>
          )}

          <PrimaryButton className="w-full" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </PrimaryButton>
        </form>

        <p style={{ textAlign: "center", marginTop: "32px", fontSize: "14px", color: "var(--color-gravel)" }}>
          还没有账号？{" "}
          <Link href="/register" className="no-underline font-medium" style={{ color: "var(--color-obsidian)" }}>
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
