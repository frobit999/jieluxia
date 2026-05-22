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
              className="h-1.5 rounded-full mb-1.5 transition-colors duration-500"
              style={{
                background: done
                  ? "linear-gradient(90deg, #4dc9f6, #ff6eb4)"
                  : active
                    ? "rgba(77, 201, 246, 0.3)"
                    : "rgba(255, 255, 255, 0.06)",
                boxShadow: done ? "0 0 6px rgba(77, 201, 246, 0.3)" : "none",
              }}
            />
            <div
              className="text-[10px]"
              style={{
                color: done ? "#4dc9f6" : "rgba(200, 220, 255, 0.4)",
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
