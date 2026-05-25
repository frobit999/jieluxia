"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useHabits } from "@/hooks/useHabits";
import { useSleepCycles } from "@/hooks/useSleepCycles";
import { useCustomGoals } from "@/hooks/useCustomGoals";
import { HABITS, getTarget, todayKey, timeGoalScore, timeToMinutes } from "@/lib/habits";
import { getWeeklyTrend, scaleTrendPoints } from "@/lib/trends";
import CompletionRing from "@/components/habits/CompletionRing";
import TrendCard from "@/components/habits/TrendCard";
import CustomGoalCard from "@/components/habits/CustomGoalCard";
import HabitDetailPage from "@/components/habits/HabitDetailPage";
import CustomGoalFormPage from "@/components/habits/CustomGoalForm";
import StatsDetailPage from "@/components/habits/StatsDetailPage";
import StatsHeaderCard from "@/components/habits/StatsHeaderCard";
import { customGoalHabitId } from "@/lib/customGoals";

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const isAuthed = !!user;

  const {
    entries, entriesByHabit, habitValues, history, streak,
    loading: habitsLoading, userGoals, saveGoals, updateHabit, deleteEntry, updateNote, reload,
  } = useHabits(isAuthed);

  const { cycles, isAwake, tapWake, tapSleep } = useSleepCycles(isAuthed);
  const { customGoals, getTodayValue, createGoal, updateGoal, deleteGoal, checkInGoal } = useCustomGoals(isAuthed, habitValues, updateHabit);

  const [openHabitId, setOpenHabitId] = useState<string | null>(null);
  const [openCustomGoalId, setOpenCustomGoalId] = useState<number | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [editingCustomGoal, setEditingCustomGoal] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!userLoading && !user) router.push("/login");
  }, [userLoading, user, router]);

  // Derived data
  const today = todayKey();
  const todayHistory = useMemo(() => {
    const m = new Map<string, number>();
    for (const [k, v] of history.entries()) {
      if (k <= today) m.set(k, v);
    }
    return m;
  }, [history, today]);

  const totalCheckins = useMemo(() => {
    let total = 0;
    for (const v of history.values()) total += v;
    return total;
  }, [history]);

  const totalDays = history.size;

  const sleepCycleTimes = useMemo(() => {
    const todayCycles = cycles.filter((c) => c.date === today);
    const latest = todayCycles[todayCycles.length - 1];
    return {
      wake: latest?.wake_time ?? null,
      sleep: latest?.sleep_time ?? null,
    };
  }, [cycles, today]);

  const sleepDone = !!sleepCycleTimes.wake;

  const weeklyTrend = useMemo(() => getWeeklyTrend(todayHistory, today), [todayHistory, today]);
  const trendLabels = weeklyTrend.map((p) => WEEKDAY[new Date(p.date + "T00:00:00").getDay()]);

  // Total completed today (for ring)
  const totalHabits = HABITS.length + customGoals.filter((g) => g.status === "active").length;

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  // Handlers
  const handleTapHabit = async (habitId: string) => {
    const habit = HABITS.find((h) => h.id === habitId);
    if (!habit) return;
    if (habit.api === "sleep-cycles") {
      if (habit.id === "wake") await tapWake();
      else await tapSleep();
    } else {
      await updateHabit(habitId, 1);
    }
  };

  const handleHabitConfirm = async (habitId: string, value: number, note?: string, timeValue?: string) => {
    const habit = HABITS.find((h) => h.id === habitId);
    if (!habit) return;
    if (habit.api === "sleep-cycles") {
      if (habit.id === "wake") await tapWake(timeValue);
      else await tapSleep(timeValue);
    } else {
      await updateHabit(habitId, value, note);
    }
  };

  const handleCustomGoalConfirm = async (goalId: number, value: number) => {
    await checkInGoal(goalId, value);
  };

  if (userLoading || habitsLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <div style={{ color: "var(--gravel)", fontSize: 14 }}>加载中...</div>
      </div>
    );
  }

  // Show stats detail page
  if (showStats) {
    return (
      <StatsDetailPage
        history={todayHistory}
        streak={streak}
        totalCheckins={totalCheckins}
        totalDays={totalDays}
        habitValues={habitValues}
        userGoals={userGoals}
        sleepDone={sleepDone}
        sleepCycleTimes={sleepCycleTimes}
        onBack={() => setShowStats(false)}
        onHabitClick={(id) => {
          setShowStats(false);
          setOpenHabitId(id);
        }}
      />
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
          onConfirm={(value, note, timeValue) => handleHabitConfirm(habit.id, value, note, timeValue)}
          onDeleteEntry={deleteEntry}
          onUpdateNote={updateNote}
        />
      );
    }
  }

  // Show custom goal detail
  if (openCustomGoalId) {
    const goal = customGoals.find((g) => g.id === openCustomGoalId);
    if (goal) {
      return (
        <CustomGoalFormPage
          goal={goal}
          onBack={() => setOpenCustomGoalId(null)}
          onSave={async (data) => {
            await updateGoal(goal.id, data);
          }}
          onDelete={async () => {
            await deleteGoal(goal.id);
          }}
          showToast={showToast}
        />
      );
    }
  }

  // Show custom goal form
  if (showCustomForm) {
    return (
      <CustomGoalFormPage
        onBack={() => setShowCustomForm(false)}
        onSave={async (data) => {
          await createGoal(data);
        }}
        showToast={showToast}
      />
    );
  }

  return (
    <>
      {/* Hero section */}
      <section style={{ marginBottom: 48 }}>
        <p className="section-label">仪表盘</p>
        <h1 className="heading-display" style={{ marginBottom: 8 }}>
          {user?.nickname ? `欢迎回来, ${user.nickname}` : "今日打卡"}
        </h1>
        <p style={{ fontSize: 15, color: "var(--gravel)", maxWidth: 480 }}>
          连续坚守 <strong style={{ color: "var(--obsidian)", fontWeight: 500 }}>{streak}</strong> 天
        </p>
      </section>

      {/* Stats header card + Completion Ring */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <StatsHeaderCard
            history={todayHistory}
            streak={streak}
            totalCheckins={totalCheckins}
            totalDays={totalDays}
            onClick={() => setShowStats(true)}
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

      {/* Built-in habits grid */}
      <section style={{ marginBottom: 48 }}>
        <p className="section-label">每日习惯</p>
        <h2 className="heading-section" style={{ marginBottom: 20 }}>
          今天的进度
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {HABITS.map((habit) => {
            const value = habitValues.get(habit.id) ?? 0;
            const target = userGoals.get(habit.id) ?? habit.target;
            const weeklyPoints = scaleTrendPoints(
              weeklyTrend.map((p) => ({ ...p, value: 0 })), // simplified - per-habit trend needs history data
              50,
            );

            if (habit.type === "tap") {
              const hasCycle = habit.id === "wake" ? !!sleepCycleTimes.wake : !!sleepCycleTimes.sleep;
              const actualTime = habit.id === "wake" ? sleepCycleTimes.wake : sleepCycleTimes.sleep;
              return (
                <TrendCard
                  key={habit.id}
                  habit={habit}
                  value={value}
                  target={target}
                  onOpen={() => setOpenHabitId(habit.id)}
                  onTap={() => handleTapHabit(habit.id)}
                  hasCycle={hasCycle}
                  actualTime={actualTime}
                  weeklyPoints={weeklyPoints}
                  trendLabels={trendLabels}
                />
              );
            }

            return (
              <TrendCard
                key={habit.id}
                habit={habit}
                value={value}
                target={target}
                onOpen={() => setOpenHabitId(habit.id)}
                onTap={() => handleTapHabit(habit.id)}
                weeklyPoints={weeklyPoints}
                trendLabels={trendLabels}
              />
            );
          })}
        </div>
      </section>

      {/* Custom goals */}
      {customGoals.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <p className="section-label">自定义目标</p>
          <h2 className="heading-section" style={{ marginBottom: 20 }}>
            我的目标
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {customGoals.map((goal) => (
              <CustomGoalCard
                key={goal.id}
                goal={goal}
                todayValue={getTodayValue(goal.id)}
                onOpen={() => setOpenCustomGoalId(goal.id)}
                onTap={() => handleCustomGoalConfirm(goal.id, 1)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Add custom goal button */}
      <section style={{ marginBottom: 48 }}>
        <button
          onClick={() => setShowCustomForm(true)}
          className="card"
          style={{
            width: "100%",
            padding: "16px 0",
            border: "1.5px dashed var(--chalk)",
            background: "transparent",
            borderRadius: 16,
            fontSize: 14,
            color: "var(--gravel)",
            cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--obsidian)";
            e.currentTarget.style.color = "var(--obsidian)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--chalk)";
            e.currentTarget.style.color = "var(--gravel)";
          }}
        >
          + 新建目标
        </button>
      </section>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 24px",
            borderRadius: 9999,
            background: toast.type === "error" ? "#ef4444" : "var(--obsidian)",
            color: "#fff",
            fontSize: 13,
            zIndex: 100,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
