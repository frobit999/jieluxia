"use client";
import { useState, useRef, useEffect } from "react";
import type { HabitDef } from "@/lib/habits";
import type { CheckinEntry } from "@/hooks/useHabits";
import DialPicker from "./DialPicker";
import HabitIcon from "./HabitIcon";

interface Props {
  habit: HabitDef; target?: number; accumulatedValue: number; entries: CheckinEntry[];
  onBack: () => void; onConfirm: (value: number, note?: string, timeValue?: string) => void | Promise<void>;
  onDeleteEntry?: (id: number) => void; onUpdateNote?: (id: number, note: string) => void;
}

export default function HabitDetailPage({ habit, target: customTarget, accumulatedValue, entries, onBack, onConfirm, onDeleteEntry, onUpdateNote }: Props) {
  const isSleepCycle = habit.id === "wake" || habit.id === "sleep";
  const effectiveTarget = customTarget ?? habit.target;
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [timeValue, setTimeValue] = useState(habit.id === "wake" ? "07:00" : "23:00");
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [editingEntryNote, setEditingEntryNote] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const displayTotal = accumulatedValue + count;
  const goBack = () => { setExiting(true); timerRef.current = setTimeout(onBack, 300); };
  const handleConfirm = async () => {
    if (!isSleepCycle && count === 0) return;
    try { await onConfirm(isSleepCycle ? 1 : count, noteText || undefined, isSleepCycle ? timeValue : undefined); setSaved(true); } catch { return; }
    timerRef.current = setTimeout(goBack, 600);
  };
  const getMax = () => { switch (habit.id) { case "water": return 500; case "exercise": return 120; case "study": return 240; case "read": return 100; default: return habit.target * 3; } };
  const formatTime = (iso: string) => { const d = new Date(iso); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const handleSaveEntryNote = (entryId: number) => { if (onUpdateNote) onUpdateNote(entryId, editingEntryNote); setEditingEntryId(null); setEditingEntryNote(""); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "var(--color-eggshell)", transform: exiting ? "translateX(100%)" : "translateX(0)", transition: "transform 0.3s ease", overflowY: "auto" }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "var(--color-eggshell)", borderBottom: "1px solid var(--color-chalk)" }}>
        <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-obsidian)" }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <HabitIcon icon={habit.icon} size={20} />
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-obsidian)" }}>{habit.name}</span>
        </div>
        <div style={{ width: 36 }} />
      </header>

      {/* Hero */}
      <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--color-powder)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <HabitIcon icon={habit.icon} size={28} />
        </div>
        <div style={{ fontSize: 13, color: "var(--color-gravel)", marginBottom: 4 }}>{habit.desc}</div>
        <div style={{ maxWidth: 280, margin: "0 auto" }}>
          <div style={{ height: 4, background: "var(--color-chalk)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${effectiveTarget > 0 ? Math.min(100, Math.round((displayTotal / effectiveTarget) * 100)) : 0}%`, background: "var(--color-obsidian)", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--color-gravel)", marginTop: 6 }}>{displayTotal} / {effectiveTarget} {habit.unit}</div>
        </div>
      </div>

      {/* Input area */}
      <div style={{ padding: "24px 20px" }}>
        {isSleepCycle ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, color: "var(--color-obsidian)", marginBottom: 12 }}>{habit.id === "wake" ? "几点起床的?" : "几点入睡的?"}</div>
            <input type="time" value={timeValue} onChange={(e) => setTimeValue(e.target.value)}
              style={{ fontSize: 32, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, border: "none", background: "var(--color-powder)", borderRadius: 0, padding: "12px 24px", color: "var(--color-obsidian)", textAlign: "center", outline: "none", borderBottom: "1px solid var(--color-obsidian)" }} />
          </div>
        ) : (
          <DialPicker value={count} max={getMax()} unit={habit.unit} onChange={setCount} hasNote={!!noteText} onNoteClick={() => setEditingNote(!editingNote)} />
        )}

        {editingNote && (
          <div style={{ marginTop: 16 }}>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="记录一下这次做了什么..."
              style={{ width: "100%", minHeight: 80, padding: 12, borderRadius: 0, border: "none", borderBottom: "1px solid var(--color-obsidian)", background: "transparent", fontSize: 14, fontFamily: "inherit", color: "var(--color-obsidian)", resize: "vertical", outline: "none", letterSpacing: "0.01em" }} autoFocus />
          </div>
        )}

        {entries.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, color: "var(--color-gravel)", marginBottom: 10, fontWeight: 500 }}>今日记录 ({entries.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {entries.map((entry) => (
                <div key={entry.id} className="card" style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-obsidian)" }}>{entry.value}{habit.unit}</span>
                      <span style={{ fontSize: 11, color: "var(--color-gravel)" }}>{formatTime(entry.checked_at)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => { setEditingEntryId(editingEntryId === entry.id ? null : entry.id); setEditingEntryNote(entry.note || ""); }}
                        style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: entry.note ? "var(--color-obsidian)" : "var(--color-chalk)" }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                      </button>
                      {onDeleteEntry && (
                        <button onClick={() => onDeleteEntry(entry.id)} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: "var(--color-chalk)" }}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                  {entry.note && editingEntryId !== entry.id && <div style={{ fontSize: 12, color: "var(--color-gravel)", marginTop: 6, lineHeight: 1.5 }}>{entry.note}</div>}
                  {editingEntryId === entry.id && (
                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <textarea value={editingEntryNote} onChange={(e) => setEditingEntryNote(e.target.value)} placeholder="记录一下..."
                        style={{ flex: 1, minHeight: 48, padding: 8, borderRadius: 0, border: "none", borderBottom: "1px solid var(--color-chalk)", background: "transparent", fontSize: 12, fontFamily: "inherit", color: "var(--color-obsidian)", resize: "vertical", outline: "none" }} autoFocus />
                      <button onClick={() => handleSaveEntryNote(entry.id)}
                        style={{ alignSelf: "flex-end", padding: "6px 16px", borderRadius: 9999, background: "var(--color-obsidian)", color: "#fff", border: "none", fontSize: 12, cursor: "pointer" }}>保存</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm */}
      <div style={{ position: "sticky", bottom: 0, padding: "16px 20px", background: "var(--color-eggshell)", borderTop: "1px solid var(--color-chalk)" }}>
        <button onClick={handleConfirm} disabled={saved || (!isSleepCycle && count === 0)}
          style={{ width: "100%", padding: "14px 0", borderRadius: 9999, border: "none", background: saved ? "var(--color-powder)" : "var(--color-obsidian)", color: saved ? "var(--color-gravel)" : "#fff", fontSize: 15, fontWeight: 500, cursor: saved ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {saved ? <><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="4 12 9 17 20 6" /></svg>已保存</> : "保存记录"}
        </button>
      </div>
    </div>
  );
}
