"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { apiGet, apiPut, apiPost } from "@/lib/api";

const emojiOptions = ["🛡️", "💪", "🔥", "⚡", "🌟", "🦁", "🦅", "🐺", "🎯", "👑", "🧘", "🏃"];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    nickname: string;
    avatarEmoji: string;
    level: number;
    title: string;
  } | null>(null);
  const [stats, setStats] = useState({ current: 0, longest: 0, totalCheckins: 0 });
  const [nickname, setNickname] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("🛡️");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet<{ user: { nickname: string; avatarEmoji: string; level: number; title: string }; stats: { current: number; longest: number; totalCheckins: number } }>("/api/profile");
        setUser(data.user);
        setStats(data.stats);
        setNickname(data.user.nickname);
        setAvatarEmoji(data.user.avatarEmoji || "🛡️");
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPut("/api/profile", { nickname, avatarEmoji });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await apiPost("/api/auth/logout");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: "400px" }}>
        <div style={{ color: "var(--color-slate)", fontSize: "14px" }}>加载中...</div>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <section style={{ marginBottom: "64px" }}>
        <p className="section-label">个人</p>
        <h1 className="heading-display" style={{ marginBottom: "12px" }}>
          个人中心
        </h1>
      </section>

      {/* Profile card */}
      <section style={{ marginBottom: "48px" }}>
        <div className="card" style={{ padding: "40px", textAlign: "center" }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto"
            style={{ background: "var(--color-obsidian)", marginBottom: "16px" }}
          >
            <span style={{ color: "var(--color-eggshell)" }}>{avatarEmoji}</span>
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "28px",
              letterSpacing: "-0.56px",
              color: "var(--color-obsidian)",
              margin: "0 0 4px",
            }}
          >
            {user?.nickname}
          </h2>
          <p className="text-body" style={{ marginBottom: "32px" }}>
            Lv.{user?.level} · {user?.title}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "48px",
              borderTop: "1px solid var(--color-chalk)",
              paddingTop: "24px",
            }}
          >
            {[
              { value: stats.current, label: "当前天数" },
              { value: stats.longest, label: "最长记录" },
              { value: stats.totalCheckins, label: "总打卡数" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, letterSpacing: "-0.56px", color: "var(--color-obsidian)" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-slate)", marginTop: "4px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit profile */}
      <section style={{ marginBottom: "48px" }}>
        <p className="section-label">编辑资料</p>
        <h2 className="heading-section" style={{ marginBottom: "24px" }}>
          个人信息
        </h2>
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--color-gravel)", marginBottom: "8px", fontWeight: 500 }}>
              头像
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    cursor: "pointer",
                    background: avatarEmoji === emoji ? "var(--color-obsidian)" : "var(--color-powder)",
                    border: "1px solid var(--color-chalk)",
                    transition: "all 0.15s",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--color-gravel)", marginBottom: "8px", fontWeight: 500 }}>
              昵称
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
            />
          </div>

          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : saved ? "已保存" : "保存修改"}
          </PrimaryButton>
        </div>
      </section>

      {/* Menu items */}
      <section style={{ marginBottom: "48px" }}>
        <p className="section-label">更多</p>
        <div className="card" style={{ overflow: "hidden" }}>
          {[
            { icon: "🏆", label: "我的成就", hint: "即将推出" },
            { icon: "📖", label: "日记记录", hint: "即将推出" },
            { icon: "🔔", label: "通知设置", hint: "即将推出" },
            { icon: "❓", label: "帮助与反馈", hint: "" },
          ].map((item, i, arr) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--color-chalk)" : "none",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: "14px", color: "var(--color-obsidian)" }}>{item.label}</span>
              {item.hint && <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>{item.hint}</span>}
              <span style={{ color: "var(--color-fog)" }}>›</span>
            </div>
          ))}
        </div>
      </section>

      {/* Logout */}
      <SecondaryButton onClick={handleLogout} className="w-full">
        退出登录
      </SecondaryButton>
    </>
  );
}
