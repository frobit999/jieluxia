export interface CustomGoal {
  id: number;
  name: string;
  icon: string;
  color: string;
  daily_target: number;
  unit: string;
  deadline: string;
  category: string;
  goal_type: "continuous" | "instant";
  status: "active" | "completed" | "archived";
  created_at: string;
  updated_at: string;
}

export const GOAL_CATEGORIES = ["学习", "健康", "消遣", "工作", "生活"] as const;

export function customGoalHabitId(goalId: number): string {
  return `custom_${goalId}`;
}

export function daysUntilDeadline(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadline + "T00:00:00");
  return Math.ceil((dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDaysRemaining(days: number): string {
  if (days < 0) return `已过期 ${Math.abs(days)} 天`;
  if (days === 0) return "今天截止";
  return `还有 ${days} 天`;
}

export const GOAL_EMOJIS = [
  "target", "book", "pencil", "notebook", "library", "medal", "sparkles", "brain",
  "zap", "dumbbell", "wind", "music", "palette", "laptop", "phone", "pen",
  "flask", "chart", "trophy", "star", "flame", "wallet", "message", "globe", "plane",
];

export const GOAL_COLORS = [
  "#ff7eb3", "#fbbf24", "#818cf8", "#60a5fa",
  "#34d399", "#c084fc", "#9cd6ee", "#f97316",
  "#fb7185", "#a78bfa",
];
