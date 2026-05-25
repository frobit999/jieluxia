const benefits = [
  { icon: "⚡", label: "精力提升", base: 10, perDay: 0.4 },
  { icon: "🧠", label: "专注力", base: 8, perDay: 0.35 },
  { icon: "💪", label: "自信心", base: 12, perDay: 0.5 },
  { icon: "😴", label: "睡眠质量", base: 6, perDay: 0.28 },
];

export function BenefitGrid({ streak }: { streak: number }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] font-medium mb-3.5 uppercase" style={{ color: "var(--color-slate)", letterSpacing: "0.05em" }}>
        身心改善
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {benefits.map((b) => {
          const val = Math.min(
            Math.round(b.base + streak * b.perDay),
            99
          );
          return (
            <div
              key={b.label}
              className="px-3 py-2.5 flex flex-col gap-1 rounded-xl"
              style={{ background: "var(--color-powder)" }}
            >
              <span className="text-base">{b.icon}</span>
              <span className="text-[11px]" style={{ color: "var(--color-gravel)" }}>
                {b.label}
              </span>
              <span className="text-base font-medium" style={{ color: "var(--color-obsidian)" }}>
                +{val}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
