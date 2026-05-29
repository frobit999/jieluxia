"use client";
import { useState, useRef, useEffect } from "react";
import { Check, ChevronLeft, Minus, Plus, Save, Trash2 } from "lucide-react";
import { AppIcon } from "@/components/AppIcon";
import type { CustomGoal } from "@/lib/customGoals";
import { GOAL_EMOJIS, GOAL_COLORS, GOAL_CATEGORIES } from "@/lib/customGoals";

interface Props {
  goal?: CustomGoal | null; onBack: () => void;
  onSave: (data: { name: string; icon: string; color: string; daily_target: number; unit: string; deadline: string; category: string; goal_type: string }) => Promise<void>;
  onDelete?: () => Promise<void>; showToast: (msg: string, type?: "success" | "error") => void;
}

export default function CustomGoalFormPage({ goal, onBack, onSave, onDelete, showToast }: Props) {
  const isEdit = !!goal;
  const [exiting, setExiting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const [name, setName] = useState(goal?.name ?? "");
  const [icon, setIcon] = useState(goal?.icon ?? "target");
  const [color, setColor] = useState(goal?.color ?? "#9cd6ee");
  const [dailyTarget, setDailyTarget] = useState(goal?.daily_target ?? 30);
  const [unit, setUnit] = useState(goal?.unit ?? "");
  const [deadline, setDeadline] = useState(goal?.deadline ?? "");
  const [category, setCategory] = useState(goal?.category ?? "");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(goal?.category && !GOAL_CATEGORIES.includes(goal.category as (typeof GOAL_CATEGORIES)[number]) ? true : false);
  const [goalType, setGoalType] = useState<"continuous" | "instant">(goal?.goal_type ?? "continuous");

  const goBack = () => { setExiting(true); timerRef.current = setTimeout(onBack, 300); };

  const handleSave = async () => {
    if (!name.trim()) { showToast("请输入目标名称", "error"); return; }
    if (dailyTarget <= 0) { showToast("每日目标必须大于 0", "error"); return; }
    if (!deadline) { showToast("请设置截止日期", "error"); return; }
    setSaving(true);
    try {
      const finalCategory = showCustomInput ? customCategory.trim() : category;
      await onSave({ name: name.trim(), icon, color, daily_target: goalType === "instant" ? 1 : dailyTarget, unit: goalType === "instant" ? "" : unit, deadline, category: finalCategory, goal_type: goalType });
      showToast(isEdit ? "目标已更新" : "目标创建成功");
      setExiting(true); timerRef.current = setTimeout(onBack, 300);
    } catch { showToast("保存失败", "error"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try { await onDelete(); showToast("目标已删除"); setExiting(true); timerRef.current = setTimeout(onBack, 300); }
    catch { showToast("删除失败", "error"); }
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 20px", borderRadius: 0, border: "none", borderBottom: "1px solid var(--color-obsidian)", background: "transparent", fontSize: 14, fontFamily: "inherit", color: "var(--color-obsidian)", outline: "none", letterSpacing: "0.01em", boxSizing: "border-box" as const };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: "var(--color-gravel)", marginBottom: 8, display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "var(--color-eggshell)", transform: exiting ? "translateX(100%)" : "translateX(0)", transition: "transform 0.3s ease", overflowY: "auto" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "var(--color-eggshell)", borderBottom: "1px solid var(--color-chalk)" }}>
        <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-obsidian)" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-obsidian)" }}>{isEdit ? "编辑目标" : "新建目标"}</span>
        <div style={{ width: 36 }} />
      </header>

      <div style={{ padding: "24px 20px 80px", display: "flex", flexDirection: "column", gap: 28 }}>
        <div><label style={labelStyle}>目标名称</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如: 雅思备考" maxLength={20} style={inputStyle} /></div>

        <div>
          <label style={labelStyle}>项目类型</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["continuous", "instant"] as const).map((t) => (
              <button key={t} onClick={() => setGoalType(t)}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 9999, border: goalType === t ? "1px solid var(--color-obsidian)" : "1px solid var(--color-chalk)", background: goalType === t ? "var(--color-obsidian)" : "#fff", color: goalType === t ? "#fff" : "var(--color-obsidian)", fontSize: 13, cursor: "pointer", textAlign: "center" as const }}>
                {t === "continuous" ? "持续项目" : "瞬时项目"}
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{t === "continuous" ? "累积数值" : "打卡即完成"}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>归属类</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GOAL_CATEGORIES.map((c) => (
              <button key={c} onClick={() => { setCategory(c); setShowCustomInput(false); }}
                style={{ padding: "6px 14px", borderRadius: 9999, border: category === c && !showCustomInput ? "1px solid var(--color-obsidian)" : "1px solid var(--color-chalk)", background: category === c && !showCustomInput ? "var(--color-obsidian)" : "#fff", color: category === c && !showCustomInput ? "#fff" : "var(--color-obsidian)", fontSize: 13, cursor: "pointer" }}>{c}</button>
            ))}
            <button onClick={() => setShowCustomInput(true)}
              style={{ padding: "6px 14px", borderRadius: 9999, border: showCustomInput ? "1px solid var(--color-obsidian)" : "1px solid var(--color-chalk)", background: showCustomInput ? "var(--color-obsidian)" : "#fff", color: showCustomInput ? "#fff" : "var(--color-obsidian)", fontSize: 13, cursor: "pointer" }}>自定义</button>
          </div>
          {showCustomInput && <input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="输入自定义分类" maxLength={10} style={{ ...inputStyle, marginTop: 8 }} />}
        </div>

        <div>
          <label style={labelStyle}>图标</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {GOAL_EMOJIS.map((e) => (
              <button key={e} onClick={() => setIcon(e)}
                style={{ width: 40, height: 40, borderRadius: 12, border: icon === e ? "1.5px solid var(--color-obsidian)" : "1px solid var(--color-chalk)", background: icon === e ? "var(--color-powder)" : "#fff", color: "var(--color-obsidian)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AppIcon name={e} size={19} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>每日目标</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setDailyTarget(Math.max(1, dailyTarget - 1))}
              style={{ width: 36, height: 36, borderRadius: 12, border: "1px solid var(--color-chalk)", background: "#fff", cursor: "pointer", color: "var(--color-obsidian)", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={16} strokeWidth={1.8} /></button>
            <input type="number" value={dailyTarget} onChange={(e) => setDailyTarget(Math.max(1, Number(e.target.value) || 1))} style={{ ...inputStyle, width: 80, textAlign: "center" as const }} />
            <button onClick={() => setDailyTarget(dailyTarget + 1)}
              style={{ width: 36, height: 36, borderRadius: 12, border: "1px solid var(--color-chalk)", background: "#fff", cursor: "pointer", color: "var(--color-obsidian)", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={16} strokeWidth={1.8} /></button>
          </div>
        </div>

        {goalType === "continuous" && <div><label style={labelStyle}>单位 (可选)</label><input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="例如: 道、分钟、页" maxLength={10} style={inputStyle} /></div>}

        <div><label style={labelStyle}>截止日期</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={isEdit ? undefined : minDate} style={inputStyle} /></div>

        {/* Preview */}
        <div>
          <label style={labelStyle}>预览</label>
          <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-powder)", flexShrink: 0, color: "var(--color-obsidian)" }}>
              <AppIcon name={icon} size={22} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-obsidian)" }}>{name || "目标名称"}</div>
              <div style={{ fontSize: 12, color: "var(--color-gravel)" }}>
                {goalType === "instant" ? "每日打卡" : unit ? `每日 ${dailyTarget} ${unit}` : `每日 ${dailyTarget}`}
                {deadline && ` · 截止 ${deadline}`}
                {(showCustomInput ? customCategory.trim() : category) && ` · ${showCustomInput ? customCategory.trim() : category}`}
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ width: "100%", padding: "14px 0", borderRadius: 9999, border: "none", background: "var(--color-obsidian)", color: "#fff", fontSize: 15, fontWeight: 500, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {!saving && (isEdit ? <Save size={16} strokeWidth={1.8} /> : <Check size={16} strokeWidth={1.8} />)}
          {saving ? "保存中..." : isEdit ? "保存修改" : "创建目标"}
        </button>

        {isEdit && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                style={{ width: "100%", padding: "12px 0", borderRadius: 9999, border: "1px solid var(--color-chalk)", background: "#fff", color: "#ef4444", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Trash2 size={15} strokeWidth={1.8} />
                删除目标
              </button>
            ) : (
              <div className="card" style={{ padding: 16, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--color-obsidian)", marginBottom: 12 }}>确定要删除这个目标吗?</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: "8px 16px", borderRadius: 9999, border: "1px solid var(--color-chalk)", background: "#fff", cursor: "pointer", fontSize: 13 }}>取消</button>
                  <button onClick={handleDelete} style={{ padding: "8px 16px", borderRadius: 9999, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: 13 }}>确认删除</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
