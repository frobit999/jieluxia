"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/Button";
import { apiGet, apiPut, apiPost } from "@/lib/api";

const emojiOptions = ["🛡️", "💪", "🔥", "⚡", "🌟", "🦁", "🦅", "🐺", "🎯", "👑", "🧘", "🏃"];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    nickname: string;
    avatarEmoji: string;
    level: number;
    title: string;
    createdAt: string;
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
        const data = await apiGet<{ user: any; stats: any }>("/api/profile");
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
        <div className="text-[rgba(180,210,255,0.5)]">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-[22px] font-bold text-[#e0f0ff] mb-6">
        个人中心 👤
      </h1>

      <GlassCard strong className="p-6 mb-4 text-center">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
          style={{ background: "linear-gradient(135deg, #4ab8ff, #1a6cb4)" }}
        >
          {avatarEmoji}
        </div>
        <div className="text-lg font-bold text-[#e0f0ff]">{user?.nickname}</div>
        <div className="text-[13px] text-[rgba(180,210,255,0.5)] mt-1">
          Lv.{user?.level} · {user?.title}
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-[#4ab8ff]">{stats.current}</div>
            <div className="text-[11px] text-[rgba(180,210,255,0.45)]">当前天数</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#4ab8ff]">{stats.longest}</div>
            <div className="text-[11px] text-[rgba(180,210,255,0.45)]">最长记录</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#4ab8ff]">{stats.totalCheckins}</div>
            <div className="text-[11px] text-[rgba(180,210,255,0.45)]">总打卡数</div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-4">
        <div className="text-xs text-[rgba(180,210,255,0.55)] font-medium tracking-wider uppercase mb-4">
          编辑资料
        </div>

        <div className="mb-4">
          <label className="block text-xs text-[rgba(180,210,255,0.6)] mb-1.5">头像</label>
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatarEmoji(emoji)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl cursor-pointer transition-all"
                style={{
                  background: avatarEmoji === emoji ? "rgba(74, 184, 255, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border: avatarEmoji === emoji ? "1px solid rgba(74, 184, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-[rgba(180,210,255,0.6)] mb-1.5">昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#e0f0ff] text-sm outline-none focus:border-[#4ab8ff] transition-colors"
          />
        </div>

        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : saved ? "已保存 ✓" : "保存修改"}
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
            className="flex items-center gap-3.5 px-2.5 py-3 cursor-pointer"
            style={{ borderBottom: i < 3 ? "1px solid rgba(255, 255, 255, 0.05)" : "none" }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-sm text-[#c0deff]">{item.label}</span>
            {item.hint && <span className="text-[11px] text-[rgba(180,210,255,0.3)]">{item.hint}</span>}
            <span className="text-base text-[rgba(180,210,255,0.3)]">›</span>
          </div>
        ))}
      </GlassCard>

      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl cursor-pointer text-sm font-semibold text-red-400 bg-transparent transition-all hover:bg-red-400/10"
        style={{ border: "1px solid rgba(239, 68, 68, 0.2)" }}
      >
        退出登录
      </button>
    </>
  );
}
