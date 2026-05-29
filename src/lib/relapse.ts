export interface RelapseInput {
  date: string;
  trigger?: string | null;
}

export interface RelapseSummary {
  total: number;
  latestDate: string | null;
  topTriggers: { trigger: string; count: number }[];
}

export function getDatesAfterLatestRelapse(
  checkinDates: string[],
  relapseDates: string[]
): string[] {
  const sortedDates = [...new Set(checkinDates)].sort();
  const latestRelapse = relapseDates.filter(Boolean).sort().at(-1);
  if (!latestRelapse) return sortedDates;

  return sortedDates.filter((date) => date > latestRelapse);
}

export function summarizeRelapses(relapses: RelapseInput[]): RelapseSummary {
  const counts = new Map<string, number>();

  for (const relapse of relapses) {
    const trigger = relapse.trigger?.trim();
    if (!trigger) continue;
    counts.set(trigger, (counts.get(trigger) ?? 0) + 1);
  }

  return {
    total: relapses.length,
    latestDate: relapses.map((r) => r.date).filter(Boolean).sort().at(-1) ?? null,
    topTriggers: [...counts.entries()]
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count || a.trigger.localeCompare(b.trigger))
      .slice(0, 3),
  };
}
