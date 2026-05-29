"use client";
import { Check, Trophy, X } from "lucide-react";
import { AppIcon } from "@/components/AppIcon";
import type { CustomGoal } from "@/lib/customGoals";
import { daysUntilDeadline } from "@/lib/customGoals";

interface Props { goal: CustomGoal; todayValue: number; onOpen: () => void; onTap: () => void; }

export default function CustomGoalCard({ goal, todayValue, onOpen, onTap }: Props) {
  const isCompleted = goal.status === "completed";
  const isInstant = goal.goal_type === "instant";
  const daysLeft = daysUntilDeadline(goal.deadline);
  const isOverdue = daysLeft < 0 && goal.status === "active";
  const isDone = todayValue >= goal.daily_target;
  const pct = isInstant ? (todayValue >= 1 ? 100 : 0) : (goal.daily_target > 0 ? Math.min(100, Math.round((todayValue / goal.daily_target) * 100)) : 0);

  const cardStyle: React.CSSProperties = { position: "relative", overflow: "hidden", cursor: "pointer", padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", opacity: isOverdue ? 0.6 : 1 };

  if (isCompleted) {
    return (
      <div className="card" style={cardStyle} onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(); }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--color-powder)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Trophy size={21} strokeWidth={1.8} color="var(--color-obsidian)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-obsidian)" }}>已完成</div>
          <div style={{ fontSize: 11, color: "var(--color-gravel)", marginTop: 2 }}>{goal.name}</div>
        </div>
        <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "var(--color-obsidian)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={12} strokeWidth={3} color="#fff" />
        </div>
      </div>
    );
  }

  const handleClick = () => { if (isOverdue) onTap(); else onOpen(); };

  return (
    <div className="card" style={cardStyle} onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${pct}%`, background: "var(--color-powder)", transition: "height 0.3s ease", pointerEvents: "none" }} />
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--color-powder)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <AppIcon name={goal.icon} size={21} />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-obsidian)", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 20 }}>
          {isInstant ? (isDone ? <Check size={16} strokeWidth={2} /> : <X size={16} strokeWidth={2} />) : `${todayValue}/${goal.daily_target}`}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-gravel)", marginTop: 2 }}>{!isInstant && goal.unit ? `${goal.name}/${goal.unit}` : goal.name}</div>
        {goal.category && <div style={{ fontSize: 10, color: "var(--color-fog)", marginTop: 2 }}>{goal.category}</div>}
      </div>
      {isDone && (
        <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "var(--color-obsidian)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={12} strokeWidth={3} color="#fff" />
        </div>
      )}
    </div>
  );
}
