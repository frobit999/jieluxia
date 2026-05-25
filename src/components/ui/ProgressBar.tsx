export function ProgressBar({
  label,
  value,
  color = "#000000",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-[14px]" style={{ color: "var(--color-gravel)" }}>{label}</span>
        <span className="text-[14px] font-medium" style={{ color: "var(--color-obsidian)" }}>
          {value}%
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: "var(--color-chalk)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: "var(--color-obsidian)",
          }}
        />
      </div>
    </div>
  );
}
