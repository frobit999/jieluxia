"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, NotebookPen, RotateCcw, Siren, Tag } from "lucide-react";
import { apiPost } from "@/lib/api";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { BottomSheet } from "./ui/BottomSheet";

const triggerOptions = [
  { value: "late_night", label: "深夜独处" },
  { value: "stress", label: "压力焦虑" },
  { value: "boredom", label: "无聊刷屏" },
  { value: "stimulus", label: "看到刺激内容" },
  { value: "habit", label: "惯性冲动" },
];

const moodOptions = ["平静", "焦虑", "沮丧", "空虚", "疲惫"];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function RelapseResetButton({
  onRecorded,
}: {
  onRecorded?: (streak: { current: number; longest: number }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(today());
  const [trigger, setTrigger] = useState("late_night");
  const [mood, setMood] = useState("焦虑");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiPost<{ streak: { current: number; longest: number } }>(
        "/api/relapses",
        { date, trigger, mood, note }
      );
      setNote("");
      setOpen(false);
      onRecorded?.(data.streak);
    } catch (err) {
      setError(err instanceof Error ? err.message : "记录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SecondaryButton onClick={() => setOpen(true)}>
        <RotateCcw size={16} strokeWidth={1.8} style={{ marginRight: 6 }} />
        记录破戒 / 重新开始
      </SecondaryButton>
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div style={{ display: "grid", gap: 18 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Siren size={14} strokeWidth={1.8} />
              重新开始
            </p>
            <h3 className="heading-sub" style={{ margin: 0 }}>记录这次破戒</h3>
            <p className="text-body" style={{ marginTop: 8 }}>
              这不是失败档案，是下一次避坑的地图。
            </p>
          </div>

          <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--color-gravel)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Calendar size={14} strokeWidth={1.8} />
              日期
            </span>
            <input
              className="input-field"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--color-gravel)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Tag size={14} strokeWidth={1.8} />
              主要诱因
            </span>
            <select
              className="input-field"
              value={trigger}
              onChange={(event) => setTrigger(event.target.value)}
            >
              {triggerOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <div>
            <div style={{ fontSize: 13, color: "var(--color-gravel)", marginBottom: 8 }}>
              当时状态
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {moodOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMood(item)}
                  className="pill"
                  style={{
                    border: "1px solid var(--color-chalk)",
                    background: mood === item ? "var(--color-obsidian)" : "#fff",
                    color: mood === item ? "var(--color-eggshell)" : "var(--color-gravel)",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--color-gravel)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <NotebookPen size={14} strokeWidth={1.8} />
              复盘
            </span>
            <textarea
              className="input-field"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="一句话复盘：当时发生了什么？下次怎么切断？"
              style={{ minHeight: 96, resize: "vertical" }}
            />
          </label>

          {error ? <p style={{ color: "#b42318", fontSize: 13, margin: 0 }}>{error}</p> : null}

          <div style={{ display: "flex", gap: 12 }}>
            <SecondaryButton className="flex-1" onClick={() => setOpen(false)}>取消</SecondaryButton>
            <PrimaryButton className="flex-[2]" onClick={submit} disabled={loading}>
              {!loading && <CheckCircle2 size={16} strokeWidth={1.8} style={{ marginRight: 6 }} />}
              {loading ? "记录中..." : "保存并重新开始"}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
