"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useHabits } from "@/hooks/useHabits";
import { useSleepCycles } from "@/hooks/useSleepCycles";
import { useCustomGoals } from "@/hooks/useCustomGoals";
import { HABITS, getTarget, todayKey, timeGoalScore, timeToMinutes } from "@/lib/habits";
import { getWeeklyTrend } from "@/lib/trends";
import StatsHeaderCard from "@/components/habits/StatsHeaderCard";
import RadarChart from "@/components/habits/RadarChart";
import CalendarWidget from "@/components/habits/CalendarWidget";
import DayDetailPanel from "@/components/habits/DayDetailPanel";
import HabitDetailPage from "@/components/habits/HabitDetailPage";
import CompletionRing from "@/components/habits/CompletionRing";
import { apiGet } from "@/lib/api";

export default function HabitsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const isAuthed = !!user;

  const {
    entriesByHabit, habitValues, history, streak,
    loading: habitsLoading, userGoals, updateHabit, deleteEntry, updateNote,
  } = useHabits(isAuthed);

  const { cycles } = useSleepCycles(isAuthed);
  const { customGoals } = useCustomGoals(isAuthed, habitValues, updateHabit);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [openHabitId, setOpenHabitId] = useState<string | null>(null);
  const [weeklyValues, setWeeklyValues] = useState<Map<string, number>>(new Map());

  const today = todayKey();

  useEffect(() => {
    if (!userLoading && !user) router.push("/login");
  }, [userLoading, user, router]);

  useEffect(() => {
    apiGet<{ habit_id: string; total: number }[]>("/api/habits/summary?days=7")
      .then((data) => {
        const map = new Map<string, number>();
        for (const r of data) map.set(r.habit_id, r.total);
        setWeeklyValues(map);
      })
      .catch(() => {});
  }, []);

  const sleepCycleTimes = useMemo(() => {
    const todayCycles = cycles.filter((c) => c.date === today);
    const latest = todayCycles[todayCycles.length - 1];
    return {
      wake: latest?.wake_time ?? null,
      sleep: latest?.sleep_time ?? null,
    };
  }, [cycles, today]);

  const sleepDone = !!sleepCycleTimes.wake;

  const totalCheckins = useMemo(() => {
    let total = 0;
    for (const v of history.values()) total += v;
    return total;
  }, [history]);

  const totalDays = history.size;

  const radarData = useMemo(() => {
    return HABITS.map((habit) => {
      const target = getTarget(habit, userGoals);
      let todayPct: number;
      if (habit.goalType === "time") {
        if (habit.id === "wake" && sleepCycleTimes.wake) {
          todayPct = timeGoalScore(timeToMinutes(sleepCycleTimes.wake), target);
        } else if (habit.id === "sleep" && sleepCycleTimes.sleep) {
          todayPct = timeGoalScore(timeToMinutes(sleepCycleTimes.sleep), target);
        } else {
          todayPct = 0;
        }
      } else {
        const val = habitValues.get(habit.id) ?? 0;
        todayPct = target > 0 ? Math.min(100, Math.round((val / target) * 100)) : 0;
      }
      const weekVal = weeklyValues.get(habit.id) ?? 0;
      const weekAvg = weekVal / 7;
      const weekPct = target > 0 ? Math.min(100, Math.round((weekAvg / target) * 100)) : 0;
      return { habitId: habit.id, name: habit.name, color: habit.color, todayPct, weekPct };
    });
  }, [habitValues, userGoals, weeklyValues, sleepCycleTimes, sleepDone]);

  const handleDayClick = (dateStr: string) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  };

  if (userLoading || habitsLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <div style={{ color: "var(--gravel)", fontSize: 14 }}>加载中...</div>
      </div>
    );
  }

  // Show habit detail page
  if (openHabitId) {
    const habit = HABITS.find((h) => h.id === openHabitId);
    if (habit) {
      const entries = entriesByHabit.get(habit.id) ?? [];
      return (
        <HabitDetailPage
          habit={habit}
          target={userGoals.get(habit.id)}
          accumulatedValue={habitValues.get(habit.id) ?? 0}
          entries={entries}
          onBack={() => setOpenHabitId(null)}
          onConfirm={async (value, note, timeValue) => {
            if (habit.api === "sleep-cycles") {
              // handled by sleep cycles hook
            } else {
              await updateHabit(habit.id, value, note);
            }
          }}
          onDeleteEntry={deleteEntry}
          onUpdateNote={updateNote}
        />
      );
    }
  }

  return (
    <div className="habits-shell">
      {/* Hero */}
      <section className="habits-hero theme-panel" style={{ marginBottom: 40 }}>
        <p className="section-label">打卡统计</p>
        <h1 className="heading-display" style={{ marginBottom: 8 }}>
          数据总览
        </h1>
      </section>

      {/* Stats header + completion ring */}
      <section className="habits-stats theme-panel" style={{ marginBottom: 40 }}>
        <div className="habits-stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <StatsHeaderCard
            history={history}
            streak={streak}
            totalCheckins={totalCheckins}
            totalDays={totalDays}
            onClick={() => {}}
          />
          <div className="card" style={{ padding: 20 }}>
            <CompletionRing
              habitValues={habitValues}
              userGoals={userGoals}
              sleepDone={sleepDone}
              sleepCycleTimes={sleepCycleTimes}
              customGoals={customGoals}
            />
          </div>
        </div>
      </section>

      {/* Radar chart */}
      <section className="habits-radar theme-panel" style={{ marginBottom: 40 }}>
        <p className="section-label">习惯雷达</p>
        <div className="card" style={{ padding: "12px 0" }}>
          <RadarChart data={radarData} onAxisClick={(id) => setOpenHabitId(id)} />
        </div>
      </section>

      {/* Calendar */}
      <section className="habits-calendar theme-panel" style={{ marginBottom: 40 }}>
        <p className="section-label">打卡日历</p>
        <div className="card" style={{ padding: 20 }}>
          <CalendarWidget history={history} onDayClick={handleDayClick} selectedDate={selectedDate} />
        </div>
      </section>

      {/* Day detail */}
      {selectedDate && <DayDetailPanel dateStr={selectedDate} onClose={() => setSelectedDate(null)} />}
    </div>
  );
}
