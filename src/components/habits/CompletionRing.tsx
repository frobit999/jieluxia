"use client";
import { useId } from "react";
import { HABITS, getTarget, timeGoalScore, timeToMinutes } from "@/lib/habits";
import type { CustomGoal } from "@/lib/customGoals";
import { customGoalHabitId } from "@/lib/customGoals";

interface Props {
  habitValues: Map<string, number>;
  userGoals?: Map<string, number>;
  sleepDone?: boolean;
  sleepCycleTimes?: { wake?: string | null; sleep?: string | null };
  customGoals?: CustomGoal[];
}

export default function CompletionRing({ habitValues, userGoals, sleepDone, sleepCycleTimes, customGoals }: Props) {
  const gradientId = useId();
  const nonTimeHabits = HABITS.filter((h) => !h.goalType);
  const timeHabits = HABITS.filter((h) => h.goalType === "time");
  const activeCustomGoals = customGoals?.filter((g) => g.status === "active") ?? [];
  const total = HABITS.length + activeCustomGoals.length;

  const nonTimeDone = nonTimeHabits.filter((h) => {
    if (h.api === "sleep-cycles") return !!sleepDone;
    return (habitValues.get(h.id) ?? 0) >= getTarget(h, userGoals);
  }).length;

  const timeDone = timeHabits.filter((h) => {
    const target = getTarget(h, userGoals);
    if (h.id === "wake" && sleepCycleTimes?.wake) return timeGoalScore(timeToMinutes(sleepCycleTimes.wake), target) > 0;
    if (h.id === "sleep" && sleepCycleTimes?.sleep) return timeGoalScore(timeToMinutes(sleepCycleTimes.sleep), target) > 0;
    return false;
  }).length;

  const customDone = activeCustomGoals.filter((g) => (habitValues.get(customGoalHabitId(g.id)) ?? 0) >= g.daily_target).length;
  const done = nonTimeDone + timeDone + customDone;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--color-chalk)" strokeWidth="6" />
        <circle
          cx="64" cy="64" r={radius}
          fill="none" stroke="var(--color-obsidian)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.72px", color: "var(--color-obsidian)" }}>
          {pct}%
        </div>
        <div style={{ fontSize: 13, color: "var(--color-gravel)", marginTop: 4 }}>
          {done === total ? "全部完成!" : `已完成 ${done}/${total} 项`}
        </div>
      </div>
    </div>
  );
}
