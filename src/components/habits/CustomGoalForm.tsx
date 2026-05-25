"use client";
import { useState, useRef, useEffect } from "react";
import type { CustomGoal } from "@/lib/customGoals";
import { GOAL_EMOJIS, GOAL_COLORS, GOAL_CATEGORIES } from "@/lib/customGoals";

interface Props {
  goal?: CustomGoal | null;
  onBack: () => void;
  onSave: (data: { name: string; icon: string; color: string; daily_target: number; unit: string; deadline: string; category: string; goal_type: string }) => Promise<void>;
  onDelete?: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function CustomGoalFormPage({ goal, onBack, onSave, onDelete, showToast }: Props) {
  const isEdit = !!goal;
  const [exiting, setExiting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const [name, setName] = useState(goal?.name ?? "");
  const [icon, setIcon] = useState(goal?.icon ?? "🎯");
  const [color, setColor] = useState(goal?.color ?? "#9cd6ee");
  const [dailyTarget, setDailyTarget] = useState(goal?.daily_target ?? 30);
  const [unit, setUnit] = useState(goal?.unit ?? "");
  const [deadline, setDeadline] = useState(goal?.deadline ?? "");
  const [category, setCategory] = useState(goal?.category ?? "");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(
    goal?.category && !GOAL_CATEGORIES.includes(goal.category as (typeof GOAL_CATEGORIES)[number]) ? true : false,
  );
  const [goalType, setGoalType] = useState<"continuous" | "instant">(goal?.goal_type ?? "continuous");

  const goBack = () => {
    setExiting(true);
    timerRef.current = setTimeout(onBack, 300);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("请输入目标名称", "error");
      return;
    }
    if (dailyTarget <= 0) {
      showToast("每日目标必须大于 0", "error");
      return;
    }
    if (!deadline) {
      showToast("请设置截止日期", "error");
      return;
    }

    setSaving(true);
    try {
      const finalCategory = showCustomInput ? customCategory.trim() : category;
      const finalTarget = goalType === "instant" ? 1 : dailyTarget;
      const finalUnit = goalType === "instant" ? "" : unit;
      await onSave({ name: name.trim(), icon, color, daily_target: finalTarget, unit: finalUnit, deadline, category: finalCategory, goal_type: goalType });
      showToast(isEdit ? "目标已更新" : "目标创建成功");
      setExiting(true);
      timerRef.current = setTimeout(onBack, 300);
    } catch {
      showToast("保存失败", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete();
      showToast("目标已删除");
      setExiting(true);
      timerRef.current = setTimeout(onBack, 300);
    } catch {
      showToast("删除失败", "error");
    }
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid var(--chalk)",
    background: "#fff",
    fontSize: 14,
    fontFamily: "inherit",
    color: "var(--obsidian)",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "var(--eggshell)",
        transform: exiting ? "translateX(100%)" : "translateX(0)",
        transition: "transform 0.3s ease",
        overflowY: "auto",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "var(--eggshell)",
          borderBottom: "1px solid var(--chalk)",
        }}
      >
        <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--obsidian)" }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--obsidian)" }}>{isEdit ? "编辑目标" : "新建目标"}</span>
        <div style={{ width: 36 }} />
      </header>

      <div style={{ padding: "24px 20px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Name */}
        <div>
          <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>目标名称</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如: 雅思备考" maxLength={20} style={inputStyle} />
        </div>

        {/* Goal Type */}
        <div>
          <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>项目类型</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["continuous", "instant"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setGoalType(t)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1.5px solid ${goalType === t ? "var(--obsidian)" : "var(--chalk)"}`,
                  background: goalType === t ? "var(--obsidian)" : "transparent",
                  color: goalType === t ? "#fff" : "var(--obsidian)",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center" as const,
                }}
              >
                {t === "continuous" ? "持续项目" : "瞬时项目"}
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{t === "continuous" ? "累积数值" : "打卡即完成"}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>归属类</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GOAL_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setShowCustomInput(false);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 9999,
                  border: `1.5px solid ${category === c && !showCustomInput ? "var(--obsidian)" : "var(--chalk)"}`,
                  background: category === c && !showCustomInput ? "var(--obsidian)" : "transparent",
                  color: category === c && !showCustomInput ? "#fff" : "var(--obsidian)",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setShowCustomInput(true)}
              style={{
                padding: "6px 14px",
                borderRadius: 9999,
                border: `1.5px solid ${showCustomInput ? "var(--obsidian)" : "var(--chalk)"}`,
                background: showCustomInput ? "var(--obsidian)" : "transparent",
                color: showCustomInput ? "#fff" : "var(--obsidian)",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              自定义
            </button>
          </div>
          {showCustomInput && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="输入自定义分类"
              maxLength={10}
              style={{ ...inputStyle, marginTop: 8 }}
            />
          )}
        </div>

        {/* Icon */}
        <div>
          <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>图标</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {GOAL_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setIcon(e)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: `1.5px solid ${icon === e ? "var(--obsidian)" : "var(--chalk)"}`,
                  background: icon === e ? "var(--powder)" : "transparent",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>颜色</label>
          <div style={{ display: "flex", gap: 8 }}>
            {GOAL_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: c,
                  border: color === c ? "2px solid var(--obsidian)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "border 0.15s",
                  outline: color === c ? "2px solid var(--eggshell)" : "none",
                  outlineOffset: 1,
                }}
              />
            ))}
          </div>
        </div>

        {/* Daily Target */}
        {goalType === "continuous" && (
          <div>
            <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>每日目标</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setDailyTarget(Math.max(1, dailyTarget - 1))}
                style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--chalk)", background: "#fff", fontSize: 18, cursor: "pointer", color: "var(--obsidian)" }}
              >
                -
              </button>
              <input
                type="number"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Math.max(1, Number(e.target.value) || 1))}
                style={{ ...inputStyle, width: 80, textAlign: "center" as const }}
              />
              <button
                onClick={() => setDailyTarget(dailyTarget + 1)}
                style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--chalk)", background: "#fff", fontSize: 18, cursor: "pointer", color: "var(--obsidian)" }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Unit */}
        {goalType === "continuous" && (
          <div>
            <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>单位 (可选)</label>
            <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="例如: 道、分钟、页" maxLength={10} style={inputStyle} />
          </div>
        )}

        {/* Deadline */}
        <div>
          <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>截止日期</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={isEdit ? undefined : minDate} style={inputStyle} />
        </div>

        {/* Preview */}
        <div>
          <label style={{ fontSize: 12, color: "var(--gravel)", marginBottom: 8, display: "block" }}>预览</label>
          <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${color}20`,
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 15, color: "var(--obsidian)" }}>{name || "目标名称"}</div>
              <div style={{ fontSize: 12, color: "var(--gravel)" }}>
                {goalType === "instant" ? "每日打卡" : unit ? `每日 ${dailyTarget} ${unit}` : `每日 ${dailyTarget}`}
                {deadline && ` · 截止 ${deadline}`}
                {(showCustomInput ? customCategory.trim() : category) && ` · ${showCustomInput ? customCategory.trim() : category}`}
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 9999,
            border: "none",
            background: "var(--obsidian)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 500,
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "保存中..." : isEdit ? "保存修改" : "创建目标"}
        </button>

        {/* Edit mode: delete */}
        {isEdit && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 9999,
                  border: "1px solid #ef4444",
                  background: "transparent",
                  color: "#ef4444",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                删除目标
              </button>
            ) : (
              <div className="card" style={{ padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--obsidian)", marginBottom: 12 }}>确定要删除这个目标吗? 所有打卡记录也会被删除。</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{ padding: "8px 16px", borderRadius: 9999, border: "1px solid var(--chalk)", background: "#fff", cursor: "pointer", fontSize: 13 }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{ padding: "8px 16px", borderRadius: 9999, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: 13 }}
                  >
                    确认删除
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
