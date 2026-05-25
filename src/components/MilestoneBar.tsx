export function MilestoneBar({
  milestones,
  current,
}: {
  milestones: { days: number; label: string }[];
  current: number;
}) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {milestones.map((m, i) => {
        const done = current >= m.days;
        const active = !done && (i === 0 || current >= milestones[i - 1].days);
        return (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                height: "3px",
                borderRadius: "2px",
                marginBottom: "8px",
                background: done
                  ? "var(--color-obsidian)"
                  : active
                    ? "var(--color-fog)"
                    : "var(--color-chalk)",
                transition: "background 0.5s",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                color: done ? "var(--color-obsidian)" : "var(--color-slate)",
                fontWeight: done ? 500 : 400,
                letterSpacing: "0.01em",
              }}
            >
              {m.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
