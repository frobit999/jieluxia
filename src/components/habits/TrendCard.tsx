"use client";
import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Plus } from "lucide-react";
import type { HabitDef } from "@/lib/habits";
import { minutesToTime } from "@/lib/habits";
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

export default function TrendCard({ habit, value, target: customTarget, onOpen, onTap, cycleSummary, hasCycle, actualTime, weeklyPoints, trendLabels }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isSleepCycle = habit.api === "sleep-cycles";
  const isTimeGoal = habit.goalType === "time";
  const isTap = habit.type === "tap";
  const effectiveTarget = customTarget ?? habit.target;
  const isDone = isTimeGoal ? (habit.id === "wake" ? hasCycle : !!actualTime) : value >= effectiveTarget;

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

  return (
    <div className="card" style={{ position: "relative", padding: "20px 24px", cursor: "pointer" }} onClick={() => setExpanded((v) => !v)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--color-gravel)", marginBottom: 4 }}>{habit.name}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, letterSpacing: "-0.56px", color: "var(--color-obsidian)" }}>{displayValue}</span>
            {displayUnit && <span style={{ fontSize: 13, color: "var(--color-gravel)" }}>{displayUnit}</span>}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-slate)", marginTop: 4 }}>{subtitle}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-powder)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HabitIcon icon={habit.icon} size={22} />
        </div>
      </div>

      {/* Done indicator */}
      {isDone && (isTap || isSleepCycle) && (
        <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: "var(--color-obsidian)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={12} strokeWidth={3} color="var(--color-on-primary)" />
        </div>
      )}

      {/* Quick-add for tap habits */}
      {isTap && !isSleepCycle && (
        <button
          onClick={(e) => { e.stopPropagation(); onTap?.(); }}
          style={{ position: "absolute", bottom: 12, right: 12, width: 28, height: 28, borderRadius: "50%", background: "var(--color-obsidian)", color: "var(--color-on-primary)", border: "none", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
        ><Plus size={16} strokeWidth={2} /></button>
      )}

      {/* Detail arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onOpen(); }}
        style={{ position: "absolute", bottom: 12, right: isTap && !isSleepCycle ? 48 : 12, width: 28, height: 28, borderRadius: 12, background: "transparent", border: "1px solid var(--color-chalk)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gravel)", zIndex: 2 }}
      >
        <ChevronRight size={14} strokeWidth={1.8} />
      </button>

      {/* Chevron */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
        <ChevronDown size={14} strokeWidth={1.8} color="var(--color-slate)" />
      </div>

      {/* Expanded chart */}
      <div style={{ maxHeight: expanded ? 120 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div style={{ paddingTop: 12 }}>
          {isSleepCycle ? (
            <div style={{ fontSize: 12, color: "var(--color-gravel)", textAlign: "center" }}>
              {habit.id === "wake" ? "近期起床记录" : "近期入睡记录"}
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "var(--color-gravel)", marginBottom: 4 }}>本周趋势</div>
              <MiniTrendChart points={weeklyPoints} height={45} xLabels={trendLabels} showDots />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
