export function WeeklyChart({
  data,
}: {
  data: { day: string; value: number }[];
}) {
  return (
    <div className="flex gap-2.5 items-end h-[100px]">
      {data.map((w, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-1.5"
        >
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${w.value}%`,
              minHeight: 12,
              background:
                i === new Date().getUTCDay()
                  ? "linear-gradient(180deg, #4dc9f6, #ff6eb4)"
                  : "rgba(77, 201, 246, 0.15)",
              border:
                i === new Date().getUTCDay()
                  ? "none"
                  : "1px solid rgba(77, 201, 246, 0.15)",
              boxShadow:
                i === new Date().getUTCDay()
                  ? "0 0 12px rgba(77, 201, 246, 0.3)"
                  : "none",
            }}
          />
          <span className="text-[11px] text-[rgba(200, 220, 255, 0.45)]">
            {w.day}
          </span>
        </div>
      ))}
    </div>
  );
}
