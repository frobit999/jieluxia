"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { StreakRing } from "@/components/StreakRing";
import { MilestoneBar } from "@/components/MilestoneBar";
import { BenefitGrid } from "@/components/BenefitGrid";
import { WeeklyChart } from "@/components/WeeklyChart";
import { QuoteCard } from "@/components/QuoteCard";
import { CheckInButton } from "@/components/CheckInButton";
import { apiGet, apiPost } from "@/lib/api";

const milestones = [
  { days: 7, label: "7天" },
  { days: 14, label: "2周" },
  { days: 30, label: "1月" },
  { days: 60, label: "2月" },
  { days: 90, label: "90天" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [weekData, setWeekData] = useState<{ day: string; value: number }[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [userData, streakData, checkinData, weekStats, monthStats] =
          await Promise.all([
            apiGet<{ user: { nickname: string } }>("/api/auth/me").catch(() => null),
            apiGet<{ current: number; longest: number }>("/api/streak").catch(() => null),
            apiGet<{ checkedIn: boolean }>("/api/checkin/today").catch(() => ({ checkedIn: false })),
            apiGet<{ weekly: { day: string; value: number }[] }>("/api/stats?range=week").catch(() => null),
            apiGet<{ activeCount: number }>("/api/stats?range=month").catch(() => null),
          ]);

        if (!userData?.user) {
          router.push("/login");
          return;
        }
        setUser(userData.user);
        setStreak(streakData?.current ?? 0);
        setLongest(streakData?.longest ?? 0);
        setCheckedIn(checkinData?.checkedIn ?? false);
        setWeekData(weekStats?.weekly ?? []);
        setActiveCount(monthStats?.activeCount ?? 0);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleCheckIn = async () => {
    try {
      const data = await apiPost<{ streak: number }>("/api/checkin");
      setCheckedIn(true);
      setStreak(data.streak);
    } catch {
      // already checked in
    }
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
          仪表盘
        </div>
        <h1 className="text-[32px] m-0 leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: "var(--color-obsidian)", letterSpacing: "-0.64px" }}>
          欢迎回来，{user?.nickname}
        </h1>
        <p className="text-[14px] mt-2" style={{ color: "var(--color-gravel)" }}>
          今天是你坚守的第 <span className="font-medium" style={{ color: "var(--color-obsidian)" }}>{streak}</span> 天，继续保持。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GlassCard strong className="p-6">
          <div className="text-[11px] font-medium mb-4 uppercase" style={{ color: "var(--color-slate)", letterSpacing: "0.05em" }}>
            当前坚守
          </div>
          <div className="flex items-center gap-5">
            <StreakRing days={streak} />
            <div>
              <div className="text-[13px] mb-1" style={{ color: "var(--color-gravel)" }}>
                连续打卡
              </div>
              <div className="text-xl font-medium" style={{ color: "var(--color-obsidian)" }}>
                第 {streak} 天
              </div>
              <div className="text-[11px] mt-1.5" style={{ color: "var(--color-slate)" }}>
                最长记录
              </div>
              <div className="text-[15px] font-medium mt-0.5" style={{ color: "var(--color-obsidian)" }}>
                {longest} 天
              </div>
            </div>
          </div>
          <div className="mt-4">
            <MilestoneBar milestones={milestones} current={streak} />
          </div>
        </GlassCard>

        <BenefitGrid streak={streak} />

        <GlassCard className="p-5 flex flex-col">
          <div className="text-[11px] font-medium mb-3.5 uppercase" style={{ color: "var(--color-slate)", letterSpacing: "0.05em" }}>
            今日签到
          </div>
          <CheckInButton checkedIn={checkedIn} onCheckIn={handleCheckIn} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <GlassCard className="p-5">
          <div className="text-[11px] font-medium mb-4 uppercase" style={{ color: "var(--color-slate)", letterSpacing: "0.05em" }}>
            本周自律指数
          </div>
          <WeeklyChart data={weekData} />
        </GlassCard>

        <QuoteCard activeCount={activeCount} />
      </div>
    </>
  );
}
