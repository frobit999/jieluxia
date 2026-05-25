const benefits = [
  { icon: "⚡", label: "精力提升", base: 10, perDay: 0.4 },
  { icon: "🧠", label: "专注力", base: 8, perDay: 0.35 },
  { icon: "💪", label: "自信心", base: 12, perDay: 0.5 },
  { icon: "😴", label: "睡眠质量", base: 6, perDay: 0.28 },
];

export function BenefitGrid({ streak }: { streak: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
      {benefits.map((b) => {
        const val = Math.min(Math.round(b.base + streak * b.perDay), 99);
        return (
          <div
            key={b.label}
            className="card"
            style={{ padding: "24px" }}
          >
            <div style={{ fontSize: "20px", marginBottom: "12px" }}>{b.icon}</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-obsidian)", marginBottom: "4px" }}>
              {b.label}
            </div>
            <div style={{ fontSize: "13px", color: "var(--color-gravel)", marginBottom: "12px" }}>
              持续改善中
            </div>
            <div
              style={{
                fontSize: "28px",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                letterSpacing: "-0.56px",
                color: "var(--color-obsidian)",
              }}
            >
              +{val}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
