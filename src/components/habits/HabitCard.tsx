"use client";
import type { HabitDef } from "@/lib/habits";
import { minutesToTime } from "@/lib/habits";
import { hexToRgb } from "@/lib/color";
import HabitIcon from "./HabitIcon";

interface Props {
  habit: HabitDef;
  value: number;
  target?: number;
  onOpen: () => void;
  onTap?: () => void;
  cycleSummary?: string;
  hasCycle?: boolean;
  actualTime?: string | null;
}

export default function HabitCard({ habit, value, target: customTarget, onOpen, onTap, cycleSummary, hasCycle, actualTime }: Props) {
  const isSleepCycle = habit.api === "sleep-cycles";
  const isTimeGoal = habit.goalType === "time";
  const effectiveTarget = customTarget ?? habit.target;
  const pct = effectiveTarget > 0 ? Math.min(100, Math.round((value / effectiveTarget) * 100)) : 0;
  const isTap = habit.type === "tap";
  const isDone = isTimeGoal ? (habit.id === "wake" ? hasCycle : !!actualTime) : value >= effectiveTarget;
  const rgb = hexToRgb(habit.color);

  let displayValue: string;
  if (isTimeGoal) {
    displayValue = `目标 ${minutesToTime(effectiveTarget)}`;
  } else if (isSleepCycle) {
    displayValue = habit.desc;
  } else {
    displayValue = value > 0 ? `${value}/${effectiveTarget}` : `0/${effectiveTarget}`;
  }

  const displayName = isTimeGoal ? actualTime ?? "未记录" : habit.unit ? `${habit.name}/${habit.unit}` : habit.name;

  const handleClick = () => {
    if ((isSleepCycle || isTap) && onTap) onTap();
    else if (!isTap) onOpen();
  };

  return (
    <div
      className="card"
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        textAlign: "center",
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      {/* Upward fill */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${pct}%`,
          background: `rgba(${rgb}, 0.08)`,
          transition: "height 0.3s ease",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: `rgba(${rgb}, 0.12)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <HabitIcon icon={habit.icon} size={22} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--obsidian)" }}>{displayValue}</div>
        <div style={{ fontSize: 11, color: "var(--gravel)", marginTop: 2 }}>{displayName}</div>
      </div>

      {isDone && (isTap || isSleepCycle) && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "var(--obsidian)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </div>
  );
}
