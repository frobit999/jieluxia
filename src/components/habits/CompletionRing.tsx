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
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center", padding: "16px 0" }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#555" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--chalk)" strokeWidth="8" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 300, lineHeight: 1, color: "var(--obsidian)" }}>
          {pct}%
        </div>
        <div style={{ fontSize: 13, color: "var(--gravel)", marginTop: 4 }}>
          {done === total ? "全部完成!" : `已完成 ${done}/${total} 项`}
        </div>
      </div>
    </div>
  );
}
