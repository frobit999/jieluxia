"use client";
import { useState } from "react";
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from "@/lib/habits";

interface Props {
  history: Map<string, number>;
  onDayClick?: (dateStr: string) => void;
  selectedDate?: string | null;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarWidget({ history, onDayClick, selectedDate }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = (getFirstDayOfMonth(year, month) + 6) % 7;
  const todayStr = formatDate(now);

  const prevMonth = () => { if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1); };
  const prevDaysInMonth = month === 0 ? getDaysInMonth(year - 1, 11) : getDaysInMonth(year, month - 1);

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`prev-${i}`} style={{ color: "var(--color-fog)", fontSize: 13, textAlign: "center", padding: "6px 0" }}>{prevDaysInMonth - firstDay + 1 + i}</div>);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const count = history.get(dateStr) ?? 0;
    const isToday = dateStr === todayStr;
    const isPast = new Date(year, month, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isSelected = selectedDate === dateStr;

    let bg = "transparent";
    let color: string = "var(--color-obsidian)";
    if (isToday && !isSelected) { bg = "var(--color-obsidian)"; color = "#fff"; }
    else if (isSelected) { bg = "var(--color-obsidian)"; color = "#fff"; }
    else if (count > 0) { bg = "var(--color-powder)"; }
    else if (isPast) { color = "var(--color-fog)"; }

    cells.push(
      <div key={dateStr} style={{ textAlign: "center", padding: "6px 0", borderRadius: 8, background: bg, color, fontSize: 13, cursor: onDayClick ? "pointer" : "default", fontWeight: isToday ? 600 : 400, transition: "background 0.15s" }}
        onClick={onDayClick ? () => onDayClick(dateStr) : undefined}>{d}</div>,
    );
  }
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    cells.push(<div key={`next-${i}`} style={{ color: "var(--color-fog)", fontSize: 13, textAlign: "center", padding: "6px 0" }}>{i}</div>);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--color-gravel)", padding: "4px 8px" }}>‹</button>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-obsidian)" }}>{year} 年 {month + 1} 月</span>
        <button onClick={nextMonth} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--color-gravel)", padding: "4px 8px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 8 }}>
        {WEEKDAYS.map((w) => <span key={w} style={{ fontSize: 11, color: "var(--color-gravel)", textAlign: "center", padding: "4px 0" }}>{w}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>{cells}</div>
    </div>
  );
}
