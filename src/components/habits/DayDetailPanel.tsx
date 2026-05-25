"use client";
import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
import { HABITS } from "@/lib/habits";
import HabitIcon from "./HabitIcon";

interface CheckinRecord { id: number; habit_id: string; value: number; note?: string; checked_at: string; }
interface Props { dateStr: string; onClose: () => void; }

export default function DayDetailPanel({ dateStr, onClose }: Props) {
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiGet<CheckinRecord[]>(`/api/habits/checkins?date=${dateStr}`)
      .then((data) => { if (!cancelled) setRecords(data); })
      .catch(() => { if (!cancelled) setRecords([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [dateStr]);

  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const formatted = `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
  const grouped = new Map<string, CheckinRecord[]>();
  for (const r of records) { const arr = grouped.get(r.habit_id) ?? []; arr.push(r); grouped.set(r.habit_id, arr); }
  const formatTime = (iso: string) => { const dt = new Date(iso); return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`; };

  return (
    <div className="card" style={{ padding: 20, marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-obsidian)" }}>{formatted}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-gravel)", padding: 4 }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      {loading ? <div style={{ textAlign: "center", color: "var(--color-gravel)", padding: 20, fontSize: 14 }}>加载中...</div>
      : records.length === 0 ? <div style={{ textAlign: "center", color: "var(--color-gravel)", padding: 20, fontSize: 14 }}>这一天没有打卡记录</div>
      : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from(grouped.entries()).map(([habitId, entries]) => {
            const habit = HABITS.find((h) => h.id === habitId);
            if (!habit) return null;
            const total = entries.reduce((s, e) => s + e.value, 0);
            const pct = habit.target > 0 ? Math.min(100, Math.round((total / habit.target) * 100)) : 0;
            return (
              <div key={habitId}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-powder)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <HabitIcon icon={habit.icon} size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-obsidian)" }}>{habit.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-obsidian)" }}>
                        {total}{habit.unit}
                        {entries.length > 1 && <span style={{ fontSize: 10, color: "var(--color-gravel)", marginLeft: 4 }}>({entries.length}次)</span>}
                      </span>
                    </div>
                    <div style={{ height: 3, background: "var(--color-chalk)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-obsidian)", borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
                {(entries.length > 1 || entries.some((e) => e.note)) && (
                  <div style={{ paddingLeft: 42, marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                    {entries.map((entry) => (
                      <div key={entry.id} style={{ fontSize: 11, color: "var(--color-gravel)", lineHeight: 1.6 }}>
                        <span>{entry.value}{habit.unit}</span>
                        <span style={{ marginLeft: 6 }}>{formatTime(entry.checked_at)}</span>
                        {entry.note && <span style={{ marginLeft: 6, color: "var(--color-obsidian)" }}>· {entry.note}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
