export function WeeklyChart({
  data,
}: {
  data: { day: string; value: number }[];
}) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", height: "120px" }}>
      {data.map((w, i) => {
        const isToday = i === new Date().getUTCDay();
        return (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: "4px 4px 0 0",
                height: `${w.value}%`,
                minHeight: "8px",
                background: isToday ? "var(--color-obsidian)" : "var(--color-chalk)",
                transition: "all 0.5s",
              }}
            />
            <span style={{ fontSize: "11px", color: isToday ? "var(--color-obsidian)" : "var(--color-slate)", fontWeight: isToday ? 500 : 400 }}>
              {w.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
