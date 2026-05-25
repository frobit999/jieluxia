export function MilestoneBar({
  milestones,
  current,
}: {
  milestones: { days: number; label: string }[];
  current: number;
}) {
  return (
    <div className="flex gap-2 items-center mt-1">
      {milestones.map((m, i) => {
        const done = current >= m.days;
        const active = !done && (i === 0 || current >= milestones[i - 1].days);
        return (
          <div key={i} className="flex-1 text-center">
            <div
              className="h-1 rounded-full mb-1.5 transition-colors duration-500"
              style={{
                background: done
                  ? "var(--color-obsidian)"
                  : active
                    ? "var(--color-fog)"
                    : "var(--color-chalk)",
              }}
            />
            <div
              className="text-[10px]"
              style={{
                color: done ? "var(--color-obsidian)" : "var(--color-slate)",
                fontWeight: done ? 500 : 400,
              }}
            >
              {m.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
