function utcToday(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function utcYesterday(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  return (new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000;
}

export function calcStreak(dates: string[]) {
  if (!dates.length) return { current: 0, longest: 0 };
  const sorted = [...dates].sort().reverse();
  const today = utcToday();
  const yesterday = utcYesterday();

  let current = 0;
  const start =
    sorted[0] === today
      ? today
      : sorted[0] === yesterday
        ? yesterday
        : null;
  if (start) {
    let d = start;
    for (const date of sorted) {
      if (date === d) {
        current++;
        d = addDays(d, -1);
      } else if (date < d) break;
    }
  }

  let longest = 0,
    streak = 1;
  const asc = [...sorted].reverse();
  for (let i = 1; i < asc.length; i++) {
    if (daysBetween(asc[i - 1], asc[i]) === 1) streak++;
    else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  return { current, longest: Math.max(longest, streak) };
}

export function getLevel(s: number) {
  if (s >= 180) return { level: 7, title: "传奇" };
  if (s >= 90) return { level: 6, title: "大师" };
  if (s >= 60) return { level: 5, title: "精英" };
  if (s >= 30) return { level: 4, title: "战士" };
  if (s >= 14) return { level: 3, title: "坚持者" };
  if (s >= 7) return { level: 2, title: "初心者" };
  return { level: 1, title: "新人" };
}
