"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useUser } from "@/hooks/useUser";
import { useHabits } from "@/hooks/useHabits";
import { useSleepCycles } from "@/hooks/useSleepCycles";
import { useCustomGoals } from "@/hooks/useCustomGoals";
import { HABITS, getTarget, todayKey, timeGoalScore, timeToMinutes } from "@/lib/habits";
import { getWeeklyTrend, scaleTrendPoints } from "@/lib/trends";
import { apiGet, apiPost } from "@/lib/api";
import { StreakRing } from "@/components/StreakRing";
import { MilestoneBar } from "@/components/MilestoneBar";
import { CheckInButton } from "@/components/CheckInButton";
import { BenefitGrid } from "@/components/BenefitGrid";
import { WeeklyChart } from "@/components/WeeklyChart";
import { QuoteCard } from "@/components/QuoteCard";
import CompletionRing from "@/components/habits/CompletionRing";
import TrendCard from "@/components/habits/TrendCard";
import CustomGoalCard from "@/components/habits/CustomGoalCard";
import HabitDetailPage from "@/components/habits/HabitDetailPage";
import CustomGoalFormPage from "@/components/habits/CustomGoalForm";
import StatsDetailPage from "@/components/habits/StatsDetailPage";
import StatsHeaderCard from "@/components/habits/StatsHeaderCard";
import { customGoalHabitId } from "@/lib/customGoals";

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

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

  // Sobriety data
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

  // Habit tracking data
  const {
    entries, entriesByHabit, habitValues, history, streak: habitStreak,
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

  const totalHabits = HABITS.length + customGoals.filter((g) => g.status === "active").length;

  const sobrietyStreak = streakData?.current ?? 0;

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  // NoFap check-in handler
  const handleCheckIn = async () => {
    await apiPost("/api/checkin");
    mutateToday({ checkedIn: true });
    // Refresh streak data
    mutateToday();
  };

  // Habit handlers
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
        <div style={{ color: "var(--color-gravel)", fontSize: 14 }}>加载中...</div>
      </div>
    );
  }

  // Sub-pages
  if (showStats) {
    return (
      <StatsDetailPage
        history={todayHistory}
        streak={habitStreak}
        totalCheckins={totalCheckins}
        totalDays={totalDays}
        habitValues={habitValues}
        userGoals={userGoals}
        sleepDone={sleepDone}
        sleepCycleTimes={sleepCycleTimes}
        onBack={() => setShowStats(false)}
        onHabitClick={(id) => { setShowStats(false); setOpenHabitId(id); }}
      />
    );
  }

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

  if (openCustomGoalId) {
    const goal = customGoals.find((g) => g.id === openCustomGoalId);
    if (goal) {
      return (
        <CustomGoalFormPage
          goal={goal}
          onBack={() => setOpenCustomGoalId(null)}
          onSave={async (data) => { await updateGoal(goal.id, data); }}
          onDelete={async () => { await deleteGoal(goal.id); }}
          showToast={showToast}
        />
      );
    }
  }

  if (showCustomForm) {
    return (
      <CustomGoalFormPage
        onBack={() => setShowCustomForm(false)}
        onSave={async (data) => { await createGoal(data); }}
        showToast={showToast}
      />
    );
  }

  return (
    <>
      {/* ═══ Hero: Sobriety Streak ═══ */}
      <section style={{ marginBottom: 40 }}>
        <p className="section-label">戒撸侠</p>
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

      {/* ═══ Daily Check-In ═══ */}
      <section className="card" style={{ padding: 24, marginBottom: 40 }}>
        <CheckInButton checkedIn={todayData?.checkedIn ?? false} onCheckIn={handleCheckIn} />
      </section>

      {/* ═══ Benefits ═══ */}
      <section style={{ marginBottom: 40 }}>
        <p className="section-label">身心改善</p>
        <h2 className="heading-section" style={{ marginBottom: 20 }}>戒除带来的好处</h2>
        <BenefitGrid streak={sobrietyStreak} />
      </section>

      {/* ═══ Weekly Discipline Chart ═══ */}
      <section className="card" style={{ padding: 24, marginBottom: 40 }}>
        <p className="section-label">自律指数</p>
        <h2 className="heading-section" style={{ marginBottom: 20, marginTop: 8 }}>本周打卡</h2>
        <WeeklyChart data={weekData?.weekly ?? []} />
      </section>

      {/* ═══ Daily Quote ═══ */}
      <section style={{ marginBottom: 48 }}>
        <p className="section-label">每日一句</p>
        <QuoteCard activeCount={monthData?.activeCount ?? 0} />
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ Habit Tracking (Secondary Section) ═══ */}
      {/* ═══════════════════════════════════════════ */}

      <div style={{ borderTop: "1px solid var(--color-chalk)", paddingTop: 48, marginBottom: 40 }}>
        <p className="section-label">习惯打卡</p>
        <h2 className="heading-section" style={{ marginBottom: 20 }}>每日习惯追踪</h2>

        {/* Stats + Completion Ring */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start", marginBottom: 24 }}>
          <StatsHeaderCard
            history={todayHistory}
            streak={habitStreak}
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

        {/* Built-in habits grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {HABITS.map((habit) => {
            const value = habitValues.get(habit.id) ?? 0;
            const target = userGoals.get(habit.id) ?? habit.target;
            const weeklyPoints = scaleTrendPoints(
              weeklyTrend.map((p) => ({ ...p, value: 0 })),
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

        {/* Custom goals */}
        {customGoals.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>自定义目标</p>
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
          </div>
        )}

        {/* Add custom goal button */}
        <button
          onClick={() => setShowCustomForm(true)}
          className="card"
          style={{
            width: "100%",
            padding: "16px 0",
            border: "1.5px dashed var(--color-chalk)",
            background: "transparent",
            borderRadius: 16,
            fontSize: 14,
            color: "var(--color-gravel)",
            cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-obsidian)";
            e.currentTarget.style.color = "var(--color-obsidian)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-chalk)";
            e.currentTarget.style.color = "var(--color-gravel)";
          }}
        >
          + 新建目标
        </button>
      </div>

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
            background: toast.type === "error" ? "#ef4444" : "var(--color-obsidian)",
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
