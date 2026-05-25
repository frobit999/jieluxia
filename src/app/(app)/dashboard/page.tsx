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
      <div className="flex items-center justify-center" style={{ height: "400px" }}>
        <div style={{ color: "var(--color-slate)", fontSize: "14px" }}>加载中...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero section */}
      <section style={{ marginBottom: "80px" }}>
        <p className="section-label">仪表盘</p>
        <h1 className="heading-display" style={{ marginBottom: "16px", maxWidth: "640px" }}>
          欢迎回来，{user?.nickname}
        </h1>
        <p className="text-body" style={{ maxWidth: "480px", fontSize: "16px", lineHeight: "1.5" }}>
          今天是你坚守的第 <strong style={{ color: "var(--color-obsidian)", fontWeight: 500 }}>{streak}</strong> 天，继续保持。
          {longest > 0 && <> 最长记录 <strong style={{ color: "var(--color-obsidian)", fontWeight: 500 }}>{longest}</strong> 天。</>}
        </p>
      </section>

      {/* Streak + Checkin row */}
      <section style={{ marginBottom: "64px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streak card — spans 2 cols */}
          <div className="lg:col-span-2 card" style={{ padding: "32px" }}>
            <p className="section-label">当前坚守</p>
            <div className="flex items-start gap-8 flex-wrap">
              <StreakRing days={streak} />
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <div className="text-body" style={{ marginBottom: "4px" }}>连续打卡</div>
                  <div style={{ fontSize: "36px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, letterSpacing: "-0.72px", color: "var(--color-obsidian)" }}>
                    第 {streak} 天
                  </div>
                </div>
                <MilestoneBar milestones={milestones} current={streak} />
              </div>
            </div>
          </div>

          {/* Checkin card */}
          <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
            <p className="section-label">今日签到</p>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <CheckInButton checkedIn={checkedIn} onCheckIn={handleCheckIn} />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section style={{ marginBottom: "64px" }}>
        <p className="section-label">身心改善</p>
        <h2 className="heading-section" style={{ marginBottom: "24px" }}>
          坚守带来的变化
        </h2>
        <BenefitGrid streak={streak} />
      </section>

      {/* Weekly chart + Quote */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div>
            <p className="section-label">本周数据</p>
            <h2 className="heading-section" style={{ marginBottom: "24px" }}>
              自律指数
            </h2>
            <div className="card" style={{ padding: "32px" }}>
              <WeeklyChart data={weekData} />
            </div>
          </div>

          <div>
            <p className="section-label">每日一句</p>
            <QuoteCard activeCount={activeCount} />
          </div>
        </div>
      </section>
    </>
  );
}
