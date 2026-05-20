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
                i === new Date().getDay()
                  ? "linear-gradient(180deg, #4ab8ff, #1a6cb4)"
                  : "rgba(74, 184, 255, 0.2)",
              border:
                i === new Date().getDay()
                  ? "none"
                  : "1px solid rgba(74, 184, 255, 0.2)",
            }}
          />
          <span className="text-[11px] text-[rgba(180, 210, 255, 0.5)]">
            {w.day}
          </span>
        </div>
      ))}
    </div>
  );
}
