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
    <div className="grid grid-cols-7 gap-1.5">
      {dayLabels.map((d) => (
        <div
          key={d}
          className="text-center text-[10px] text-[rgba(200,220,255,0.4)] pb-1.5"
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
            className="w-full aspect-square rounded-lg flex items-center justify-center text-[11px] transition-colors"
            style={{
              background: isToday
                ? "linear-gradient(135deg, #4dc9f6, #ff6eb4)"
                : checked
                  ? "rgba(77, 201, 246, 0.15)"
                  : "rgba(255, 255, 255, 0.03)",
              color: isToday
                ? "#fff"
                : checked
                  ? "#4dc9f6"
                  : "rgba(200, 220, 255, 0.4)",
              fontWeight: isToday ? 700 : 400,
              border: isToday
                ? "none"
                : checked
                  ? "1px solid rgba(77, 201, 246, 0.25)"
                  : "1px solid rgba(255, 255, 255, 0.04)",
              boxShadow: isToday ? "0 0 12px rgba(77, 201, 246, 0.3)" : "none",
            }}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}
