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
                  ? "var(--color-obsidian)"
                  : "var(--color-chalk)",
            }}
          />
          <span className="text-[11px]" style={{ color: "var(--color-slate)" }}>
            {w.day}
          </span>
        </div>
      ))}
    </div>
  );
}
