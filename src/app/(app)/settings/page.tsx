"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
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
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--color-slate)" }}>加载中...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="text-[11px] font-medium mb-2 uppercase" style={{ color: "var(--color-slate)", letterSpacing: "0.05em" }}>
          个人
        </div>
        <h1 className="text-[32px] m-0 leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: "var(--color-obsidian)", letterSpacing: "-0.64px" }}>
          个人中心
        </h1>
      </div>

      <GlassCard className="p-6 mb-4 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
          style={{ background: "var(--color-obsidian)" }}
        >
          <span style={{ color: "var(--color-eggshell)" }}>{avatarEmoji}</span>
        </div>
        <div className="text-lg font-medium" style={{ color: "var(--color-obsidian)" }}>{user?.nickname}</div>
        <div className="text-[13px] mt-1" style={{ color: "var(--color-gravel)" }}>
          Lv.{user?.level} · {user?.title}
        </div>

        <div className="flex justify-center gap-8 mt-5">
          <div className="text-center">
            <div className="text-xl font-medium" style={{ color: "var(--color-obsidian)" }}>{stats.current}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--color-slate)" }}>当前天数</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium" style={{ color: "var(--color-obsidian)" }}>{stats.longest}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--color-slate)" }}>最长记录</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-medium" style={{ color: "var(--color-obsidian)" }}>{stats.totalCheckins}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--color-slate)" }}>总打卡数</div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-4">
        <div className="text-[11px] font-medium mb-4 uppercase" style={{ color: "var(--color-slate)", letterSpacing: "0.05em" }}>
          编辑资料
        </div>

        <div className="mb-4">
          <label className="block text-[12px] mb-1.5" style={{ color: "var(--color-gravel)" }}>头像</label>
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatarEmoji(emoji)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg cursor-pointer transition-all"
                style={{
                  background: avatarEmoji === emoji ? "var(--color-obsidian)" : "var(--color-powder)",
                  border: "1px solid var(--color-chalk)",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[12px] mb-1.5" style={{ color: "var(--color-gravel)" }}>昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 text-[14px] outline-none"
            style={{
              background: "#ffffff",
              border: "1px solid var(--color-chalk)",
              borderRadius: "4px",
              color: "var(--color-obsidian)",
            }}
          />
        </div>

        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : saved ? "已保存" : "保存修改"}
        </PrimaryButton>
      </GlassCard>

      <GlassCard className="p-2 mb-4">
        {[
          { icon: "🏆", label: "我的成就", hint: "即将推出" },
          { icon: "📖", label: "日记记录", hint: "即将推出" },
          { icon: "🔔", label: "通知设置", hint: "即将推出" },
          { icon: "❓", label: "帮助与反馈", hint: "" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 px-3 py-3 cursor-pointer"
            style={{ borderBottom: i < 3 ? "1px solid var(--color-chalk)" : "none" }}
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1 text-[14px]" style={{ color: "var(--color-obsidian)" }}>{item.label}</span>
            {item.hint && <span className="text-[11px]" style={{ color: "var(--color-slate)" }}>{item.hint}</span>}
            <span className="text-base" style={{ color: "var(--color-fog)" }}>›</span>
          </div>
        ))}
      </GlassCard>

      <SecondaryButton
        onClick={handleLogout}
        className="w-full"
      >
        退出登录
      </SecondaryButton>
    </>
  );
}
