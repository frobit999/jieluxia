export function ProgressBar({
  label,
  value,
  color = "#4ab8ff",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px] text-[#b0d8ff]">{label}</span>
        <span className="text-[13px] font-semibold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div
        className="h-[5px] rounded overflow-hidden"
        style={{ background: "rgba(255, 255, 255, 0.08)" }}
      >
        <div
          className="h-full rounded transition-all duration-700"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
          }}
        />
      </div>
    </div>
  );
}
