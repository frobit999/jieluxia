export function ProgressBar({
  label,
  value,
  color = "#4dc9f6",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px] text-[rgba(200,220,255,0.75)]">{label}</span>
        <span className="text-[13px] font-semibold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div
        className="h-[5px] rounded-full overflow-hidden"
        style={{ background: "rgba(255, 255, 255, 0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, #ff6eb4)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
