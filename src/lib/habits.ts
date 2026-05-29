export interface HabitDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
  target: number;
  unit: string;
  type?: "tap";
  api?: "sleep-cycles";
  goalType?: "time";
}

export const HABITS: HabitDef[] = [
  { id: "study", name: "学习", icon: "book", desc: "专注学习，持续成长", color: "#ff7eb3", target: 90, unit: "分钟" },
  { id: "wake", name: "起床", icon: "alarm", desc: "记录起床时间", color: "#fbbf24", target: 420, unit: "", type: "tap", api: "sleep-cycles", goalType: "time" },
  { id: "sleep", name: "入睡", icon: "moon", desc: "记录入睡时间", color: "#818cf8", target: 1380, unit: "", type: "tap", api: "sleep-cycles", goalType: "time" },
  { id: "water", name: "喝水", icon: "droplet", desc: "喝够 2000ml，保持水润", color: "#60a5fa", target: 2000, unit: "毫升" },
  { id: "exercise", name: "运动", icon: "dumbbell", desc: "活动身体，保持活力", color: "#34d399", target: 30, unit: "分钟" },
  { id: "read", name: "消遣", icon: "gamepad", desc: "放松消遣，享受时光", color: "#c084fc", target: 30, unit: "分钟" },
  { id: "poop", name: "拉屎", icon: "activity", desc: "记录排便情况，关注肠胃", color: "#a78bfa", target: 1, unit: "次" },
];

export function getTarget(habit: HabitDef, userGoals?: Map<string, number>): number {
  if (userGoals && userGoals.has(habit.id)) return userGoals.get(habit.id)!;
  return habit.target;
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function timeGoalScore(actualMinutes: number, targetMinutes: number): number {
  const diff = Math.abs(actualMinutes - targetMinutes);
  if (diff >= 60) return 0;
  return Math.round(((60 - diff) / 60) * 100);
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
