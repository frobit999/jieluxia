"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import { apiGet } from "@/lib/api";

export default function RecordsPage() {
  const router = useRouter();
  const [checkinDates, setCheckinDates] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  useEffect(() => {
    async function load() {
      try {
        const [userData, monthData, streakData] = await Promise.all([
          apiGet<{ user: { nickname: string } }>("/api/auth/me").catch(() => null),
          apiGet<{ checkins: string[] }>(
            `/api/stats?range=month&month=${year}-${String(month).padStart(2, "0")}`
          ).catch(() => null),
          apiGet<{ current: number }>("/api/streak").catch(() => null),
        ]);

        if (!userData?.user) {
          router.push("/login");
          return;
        }
        setCheckinDates(new Set(monthData?.checkins ?? []));
        setStreak(streakData?.current ?? 0);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, year, month]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[rgba(200,220,255,0.5)]">加载中...</div>
      </div>
    );
  }

  const metrics = [
    { label: "精力", value: Math.min(85 + streak, 99), color: "#4dc9f6" },
    { label: "专注力", value: Math.min(72 + streak, 99), color: "#a78bfa" },
    { label: "情绪稳定", value: Math.min(90 + Math.floor(streak / 2), 99), color: "#ff6eb4" },
    { label: "睡眠质量", value: Math.min(68 + streak, 99), color: "#4dc9f6" },
  ];

  return (
    <>
      <h1 className="text-[22px] font-bold text-[#e8f4ff] mb-6">
        数据统计 📊
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <div className="text-xs text-[rgba(200,220,255,0.55)] font-medium tracking-wider uppercase mb-3">
            {year}年{month}月打卡日历
          </div>
          <MonthlyCalendar
            checkinDates={checkinDates}
            year={year}
            month={month}
          />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-xs text-[rgba(200,220,255,0.55)] font-medium tracking-wider uppercase mb-3">
            身心数据
          </div>
          {metrics.map((m) => (
            <ProgressBar
              key={m.label}
              label={m.label}
              value={m.value}
              color={m.color}
            />
          ))}
        </GlassCard>
      </div>
    </>
  );
}
