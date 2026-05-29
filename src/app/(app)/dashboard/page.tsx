"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useUser } from "@/hooks/useUser";
import { apiGet, apiPost } from "@/lib/api";
import { StreakRing } from "@/components/StreakRing";
import { MilestoneBar } from "@/components/MilestoneBar";
import { CheckInButton } from "@/components/CheckInButton";
import { BenefitGrid } from "@/components/BenefitGrid";
import { WeeklyChart } from "@/components/WeeklyChart";
import { QuoteCard } from "@/components/QuoteCard";

const milestones = [
  { days: 7, label: "7天" },
  { days: 14, label: "2周" },
  { days: 30, label: "1月" },
  { days: 60, label: "2月" },
  { days: 90, label: "90天" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const isAuthed = !!user;

  const { data: streakData } = useSWR<{ current: number; longest: number }>(
    isAuthed ? "/api/streak" : null,
    apiGet
  );
  const { data: todayData, mutate: mutateToday } = useSWR<{ checkedIn: boolean }>(
    isAuthed ? "/api/checkin/today" : null,
    apiGet
  );
  const { data: weekData } = useSWR<{ weekly: { day: string; value: number }[] }>(
    isAuthed ? "/api/stats?range=week" : null,
    apiGet
  );
  const { data: monthData } = useSWR<{ activeCount: number }>(
    isAuthed ? "/api/stats?range=month" : null,
    apiGet
  );

  useEffect(() => {
    if (!userLoading && !user) router.push("/login");
  }, [userLoading, user, router]);

  const sobrietyStreak = streakData?.current ?? 0;

  const handleCheckIn = async () => {
    await apiPost("/api/checkin");
    mutateToday({ checkedIn: true });
  };

  if (userLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <div style={{ color: "var(--color-gravel)", fontSize: 14 }}>加载中...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero: Sobriety Streak */}
      <section style={{ marginBottom: 40 }}>
        <p className="section-label">岁月清风</p>
        <h1 className="heading-display" style={{ marginBottom: 4 }}>
          {user?.nickname ? `${user.nickname}，继续加油` : "每一次克制都是胜利"}
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-gravel)", marginBottom: 24 }}>
          级别: {user?.title ?? "新人"} · Lv.{user?.level ?? 1}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <StreakRing days={sobrietyStreak} label="天" goalDays={90} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--color-gravel)", marginBottom: 12 }}>
              已坚持 <strong style={{ color: "var(--color-obsidian)", fontWeight: 500, fontSize: 18 }}>{sobrietyStreak}</strong> 天
            </div>
            <MilestoneBar milestones={milestones} current={sobrietyStreak} />
          </div>
        </div>
      </section>

      {/* Daily Check-In */}
      <section className="card" style={{ padding: 24, marginBottom: 40 }}>
        <CheckInButton checkedIn={todayData?.checkedIn ?? false} onCheckIn={handleCheckIn} />
      </section>

      {/* Benefits */}
      <section style={{ marginBottom: 40 }}>
        <p className="section-label">身心改善</p>
        <h2 className="heading-section" style={{ marginBottom: 20 }}>戒除带来的好处</h2>
        <BenefitGrid streak={sobrietyStreak} />
      </section>

      {/* Weekly Discipline Chart */}
      <section className="card" style={{ padding: 24, marginBottom: 40 }}>
        <p className="section-label">自律指数</p>
        <h2 className="heading-section" style={{ marginBottom: 20, marginTop: 8 }}>本周打卡</h2>
        <WeeklyChart data={weekData?.weekly ?? []} />
      </section>

      {/* Daily Quote */}
      <section style={{ marginBottom: 48 }}>
        <p className="section-label">每日一句</p>
        <QuoteCard activeCount={monthData?.activeCount ?? 0} />
      </section>
    </>
  );
}
