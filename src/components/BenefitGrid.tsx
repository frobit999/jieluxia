import { GlassCard } from "./ui/GlassCard";

const benefits = [
  { icon: "⚡", label: "精力提升", base: 10, perDay: 0.4 },
  { icon: "🧠", label: "专注力", base: 8, perDay: 0.35 },
  { icon: "💪", label: "自信心", base: 12, perDay: 0.5 },
  { icon: "😴", label: "睡眠质量", base: 6, perDay: 0.28 },
];

export function BenefitGrid({ streak }: { streak: number }) {
  return (
    <GlassCard className="p-5">
      <div className="text-xs text-[rgba(200,220,255,0.6)] mb-3.5 font-medium tracking-wider uppercase">
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
              className="glass-pill px-3 py-2.5 flex flex-col gap-1"
            >
              <span className="text-lg">{b.icon}</span>
              <span className="text-[11px] text-[rgba(200,220,255,0.6)]">
                {b.label}
              </span>
              <span className="text-base font-bold text-[#4dc9f6]">
                +{val}%
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
