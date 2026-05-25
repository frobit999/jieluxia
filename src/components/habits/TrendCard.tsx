"use client";
import { useState } from "react";
import type { HabitDef } from "@/lib/habits";
import { minutesToTime } from "@/lib/habits";
import { hexToRgb } from "@/lib/color";
import HabitIcon from "./HabitIcon";
import MiniTrendChart from "./MiniTrendChart";

interface Props {
  habit: HabitDef;
  value: number;
  target?: number;
  onOpen: () => void;
  onTap?: () => void;
  cycleSummary?: string;
  hasCycle?: boolean;
  actualTime?: string | null;
  weeklyPoints: number[];
  trendLabels: string[];
}

export default function TrendCard({
  habit, value, target: customTarget, onOpen, onTap,
  cycleSummary, hasCycle, actualTime,
  weeklyPoints, trendLabels,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const isSleepCycle = habit.api === "sleep-cycles";
  const isTimeGoal = habit.goalType === "time";
  const isTap = habit.type === "tap";
  const effectiveTarget = customTarget ?? habit.target;
  const isDone = isTimeGoal ? (habit.id === "wake" ? hasCycle : !!actualTime) : value >= effectiveTarget;
  const rgb = hexToRgb(habit.color);

  let displayValue: string;
  let displayUnit: string;
  let subtitle: string;

  if (isTimeGoal) {
    displayValue = actualTime || "--:--";
    displayUnit = "";
    subtitle = `目标 ${minutesToTime(effectiveTarget)}`;
  } else if (isSleepCycle) {
    displayValue = cycleSummary ?? habit.desc;
    displayUnit = "";
    subtitle = hasCycle ? "已打卡" : "未打卡";
  } else {
    displayValue = String(value);
    displayUnit = habit.unit ? `/${effectiveTarget}${habit.unit}` : `/${effectiveTarget}`;
    subtitle = habit.desc;
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTap?.();
  };

  return (
    <div className="card" style={{ position: "relative", padding: "20px 24px", cursor: "pointer" }} onClick={() => setExpanded((v) => !v)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 4 }}>{habit.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 300, color: "var(--obsidian)" }}>{displayValue}</span>
            {displayUnit && <span style={{ fontSize: 13, color: "var(--gravel)" }}>{displayUnit}</span>}
          </div>
          <div style={{ fontSize: 12, color: "var(--gravel)", marginTop: 4 }}>{subtitle}</div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: `rgba(${rgb}, 0.1)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HabitIcon icon={habit.icon} size={24} />
        </div>
      </div>

      {isDone && (isTap || isSleepCycle) && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
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

      {isTap && !isSleepCycle && (
        <button
          onClick={handleQuickAdd}
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--obsidian)",
            color: "#fff",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          +
        </button>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        style={{
          position: "absolute",
          bottom: 12,
          right: isTap && !isSleepCycle ? 48 : 12,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "var(--powder)",
          border: "none",
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--gravel)",
          zIndex: 2,
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Chevron */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 8,
          transition: "transform 0.2s",
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--gravel)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expanded chart area */}
      <div
        style={{
          maxHeight: expanded ? 120 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div style={{ paddingTop: 12 }}>
          {isSleepCycle ? (
            <div style={{ fontSize: 12, color: "var(--gravel)", textAlign: "center" }}>
              {habit.id === "wake" ? "近期起床记录" : "近期入睡记录"}
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "var(--gravel)", marginBottom: 4 }}>本周趋势</div>
              <MiniTrendChart points={weeklyPoints} color={habit.color} height={50} xLabels={trendLabels} showDots />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
