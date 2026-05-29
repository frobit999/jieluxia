"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import { apiGet } from "@/lib/api";

interface RelapseSummary {
  total: number;
  latestDate: string | null;
  topTriggers: { trigger: string; count: number }[];
}

const triggerLabels: Record<string, string> = {
  late_night: "深夜独处",
  stress: "压力焦虑",
  boredom: "无聊刷屏",
  stimulus: "刺激内容",
  habit: "惯性冲动",
};

function triggerLabel(trigger: string): string {
  return triggerLabels[trigger] ?? trigger;
}

export default function RecordsPage() {
  const router = useRouter();
  const [checkinDates, setCheckinDates] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [relapseSummary, setRelapseSummary] = useState<RelapseSummary>({
    total: 0,
    latestDate: null,
    topTriggers: [],
  });
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  useEffect(() => {
    async function load() {
      try {
        const [userData, monthData, streakData, relapseData] = await Promise.all([
          apiGet<{ user: { nickname: string } }>("/api/auth/me").catch(() => null),
          apiGet<{ checkins: string[] }>(
            `/api/stats?range=month&month=${year}-${String(month).padStart(2, "0")}`
          ).catch(() => null),
          apiGet<{ current: number }>("/api/streak").catch(() => null),
          apiGet<{ summary: RelapseSummary }>("/api/relapses").catch(() => null),
        ]);

        if (!userData?.user) {
          router.push("/login");
          return;
        }
        setCheckinDates(new Set(monthData?.checkins ?? []));
        setStreak(streakData?.current ?? 0);
        if (relapseData?.summary) setRelapseSummary(relapseData.summary);
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

      <section style={{ marginTop: "48px" }}>
        <p className="section-label">复盘</p>
        <h2 className="heading-section" style={{ marginBottom: "24px" }}>
          破戒模式
        </h2>
        <div className="card" style={{ padding: "24px" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <div style={{ fontSize: 13, color: "var(--color-gravel)", marginBottom: 8 }}>
                累计重启
              </div>
              <div style={{ fontSize: 32, fontWeight: 500, color: "var(--color-obsidian)" }}>
                {relapseSummary.total}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-gravel)", marginBottom: 8 }}>
                最近一次
              </div>
              <div style={{ fontSize: 18, color: "var(--color-obsidian)" }}>
                {relapseSummary.latestDate ?? "暂无记录"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-gravel)", marginBottom: 8 }}>
                高频诱因
              </div>
              {relapseSummary.topTriggers.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {relapseSummary.topTriggers.map((item) => (
                    <div
                      key={item.trigger}
                      style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}
                    >
                      <span style={{ color: "var(--color-obsidian)" }}>{triggerLabel(item.trigger)}</span>
                      <span style={{ color: "var(--color-gravel)" }}>{item.count} 次</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "var(--color-gravel)" }}>
                  还没有可分析的诱因
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
