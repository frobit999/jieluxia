export function MonthlyCalendar({
  checkinDates,
  year,
  month,
}: {
  checkinDates: Set<string>;
  year: number;
  month: number;
}) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const today = new Date();
  const todayStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
  const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];

  const offset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
      {dayLabels.map((d) => (
        <div
          key={d}
          style={{ textAlign: "center", fontSize: "11px", color: "var(--color-slate)", paddingBottom: "8px" }}
        >
          {d}
        </div>
      ))}
      {Array.from({ length: offset }, (_, i) => (
        <div key={`empty-${i}`} />
      ))}
      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const checked = checkinDates.has(dateStr);
        const isToday = dateStr === todayStr;

        return (
          <div
            key={d}
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              background: isToday ? "var(--color-obsidian)" : checked ? "var(--color-powder)" : "transparent",
              color: isToday ? "var(--color-eggshell)" : checked ? "var(--color-obsidian)" : "var(--color-slate)",
              fontWeight: isToday ? 500 : 400,
              border: isToday ? "none" : checked ? "1px solid var(--color-chalk)" : "1px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}
