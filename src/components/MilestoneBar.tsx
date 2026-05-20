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
              className="h-1.5 rounded mb-1.5 transition-colors duration-500"
              style={{
                background: done
                  ? "linear-gradient(90deg, #4ab8ff, #0066cc)"
                  : active
                    ? "rgba(74, 184, 255, 0.35)"
                    : "rgba(255, 255, 255, 0.08)",
              }}
            />
            <div
              className="text-[10px]"
              style={{
                color: done ? "#4ab8ff" : "rgba(180, 210, 255, 0.4)",
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
