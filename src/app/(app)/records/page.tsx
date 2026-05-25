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
      <div className="flex items-center justify-center" style={{ height: "400px" }}>
        <div style={{ color: "var(--color-slate)", fontSize: "14px" }}>加载中...</div>
      </div>
    );
  }

  const metrics = [
    { label: "精力", value: Math.min(85 + streak, 99) },
    { label: "专注力", value: Math.min(72 + streak, 99) },
    { label: "情绪稳定", value: Math.min(90 + Math.floor(streak / 2), 99) },
    { label: "睡眠质量", value: Math.min(68 + streak, 99) },
  ];

  return (
    <>
      {/* Page header */}
      <section style={{ marginBottom: "64px" }}>
        <p className="section-label">统计</p>
        <h1 className="heading-display" style={{ marginBottom: "12px" }}>
          数据统计
        </h1>
        <p className="text-body" style={{ maxWidth: "480px" }}>
          追踪你的打卡记录和身心变化数据。
        </p>
      </section>

      {/* Calendar + Metrics */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="section-label">{year}年{month}月</p>
            <h2 className="heading-section" style={{ marginBottom: "24px" }}>
              打卡日历
            </h2>
            <div className="card" style={{ padding: "24px" }}>
              <MonthlyCalendar
                checkinDates={checkinDates}
                year={year}
                month={month}
              />
            </div>
          </div>

          <div>
            <p className="section-label">身心数据</p>
            <h2 className="heading-section" style={{ marginBottom: "24px" }}>
              改善指标
            </h2>
            <div className="card" style={{ padding: "24px" }}>
              {metrics.map((m) => (
                <ProgressBar
                  key={m.label}
                  label={m.label}
                  value={m.value}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
