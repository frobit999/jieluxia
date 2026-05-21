export function calcStreak(dates: string[]) {
  if (!dates.length) return { current: 0, longest: 0 };
  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

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
        const t = new Date(d + "T00:00:00Z");
        t.setUTCDate(t.getUTCDate() - 1);
        d = t.toISOString().slice(0, 10);
      } else if (date < d) break;
    }
  }

  let longest = 0,
    streak = 1;
  const asc = [...sorted].reverse();
  for (let i = 1; i < asc.length; i++) {
    const diff =
      (new Date(asc[i] + "T00:00:00Z").getTime() -
        new Date(asc[i - 1] + "T00:00:00Z").getTime()) /
      86400000;
    if (diff === 1) streak++;
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
