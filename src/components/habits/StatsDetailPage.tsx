"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import CalendarWidget from "./CalendarWidget";
import DayDetailPanel from "./DayDetailPanel";
import RadarChart from "./RadarChart";
import { HABITS, getTarget, timeGoalScore, timeToMinutes } from "@/lib/habits";
import { apiGet } from "@/lib/api";

interface Props {
  history: Map<string, number>; streak: number; totalCheckins: number; totalDays: number;
  habitValues: Map<string, number>; userGoals: Map<string, number>;
  sleepDone?: boolean; sleepCycleTimes?: { wake?: string | null; sleep?: string | null };
  onBack: () => void; onHabitClick?: (habitId: string) => void;
}

export default function StatsDetailPage({ history, streak, totalCheckins, totalDays, habitValues, userGoals, sleepCycleTimes, onBack, onHabitClick }: Props) {
  const [exiting, setExiting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weeklyValues, setWeeklyValues] = useState<Map<string, number>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  useEffect(() => {
    apiGet<{ habit_id: string; total: number }[]>("/api/habits/summary?days=7")
      .then((data) => { const map = new Map<string, number>(); for (const r of data) map.set(r.habit_id, r.total); setWeeklyValues(map); })
      .catch(() => {});
  }, []);

  const goBack = () => { setExiting(true); timerRef.current = setTimeout(onBack, 300); };
  const handleDayClick = (dateStr: string) => { setSelectedDate((prev) => (prev === dateStr ? null : dateStr)); };

  const radarData = useMemo(() => HABITS.map((habit) => {
    const target = getTarget(habit, userGoals);
    let todayPct: number;
    if (habit.goalType === "time") {
      if (habit.id === "wake" && sleepCycleTimes?.wake) todayPct = timeGoalScore(timeToMinutes(sleepCycleTimes.wake), target);
      else if (habit.id === "sleep" && sleepCycleTimes?.sleep) todayPct = timeGoalScore(timeToMinutes(sleepCycleTimes.sleep), target);
      else todayPct = 0;
    } else { const val = habitValues.get(habit.id) ?? 0; todayPct = target > 0 ? Math.min(100, Math.round((val / target) * 100)) : 0; }
    const weekVal = weeklyValues.get(habit.id) ?? 0;
    const weekPct = target > 0 ? Math.min(100, Math.round((weekVal / 7 / target) * 100)) : 0;
    return { habitId: habit.id, name: habit.name, color: habit.color, todayPct, weekPct };
  }), [habitValues, userGoals, weeklyValues, sleepCycleTimes]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "var(--color-eggshell)", transform: exiting ? "translateX(100%)" : "translateX(0)", transition: "transform 0.3s ease", overflowY: "auto" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "var(--color-eggshell)", borderBottom: "1px solid var(--color-chalk)" }}>
        <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-obsidian)" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-obsidian)" }}>统计详情</span>
        <div style={{ width: 36 }} />
      </header>

      <div style={{ padding: "24px 20px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 40 }}>
          {[{ val: streak, label: "连续天数" }, { val: totalDays, label: "活跃天数" }, { val: totalCheckins, label: "累计打卡" }].map((item) => (
            <div key={item.label} className="card" style={{ padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, letterSpacing: "-0.56px", color: "var(--color-obsidian)" }}>{item.val}</div>
              <div style={{ fontSize: 11, color: "var(--color-gravel)", marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <p className="section-label">习惯雷达</p>
        <div className="card" style={{ padding: "12px 0", marginBottom: 40 }}>
          <RadarChart data={radarData} onAxisClick={onHabitClick} />
        </div>

        <p className="section-label">打卡日历</p>
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <CalendarWidget history={history} onDayClick={handleDayClick} selectedDate={selectedDate} />
        </div>

        {selectedDate && <DayDetailPanel dateStr={selectedDate} onClose={() => setSelectedDate(null)} />}
      </div>
    </div>
  );
}
