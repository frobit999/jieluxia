"use client";

interface Props {
  points: number[];
  color: string;
  height?: number;
  xLabels?: string[];
  showDots?: boolean;
}

export default function MiniTrendChart({ points, color, height = 60, xLabels, showDots = true }: Props) {
  if (points.length < 2) return null;
  const maxVal = Math.max(...points, 1);
  const xStep = 300 / (points.length - 1);
  const scale = maxVal > 0 ? height / maxVal : 1;

  const pts = points.map((v, i) => ({
    x: Math.round(i * xStep),
    y: Math.round(height - v * scale),
  }));

  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = Math.round(pts[i].x + xStep * 0.45);
    const cp2x = Math.round(pts[i + 1].x - xStep * 0.45);
    pathD += ` C ${cp1x} ${pts[i].y} ${cp2x} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }

  return (
    <div style={{ position: "relative", height, width: "100%", marginTop: 8 }}>
      <svg
        style={{ display: "block", width: "100%", height: "100%" }}
        preserveAspectRatio="none"
        viewBox={`0 0 300 ${height}`}
      >
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {showDots &&
          pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === 0 || i === pts.length - 1 ? 3.5 : 2.5} fill={color} />
          ))}
      </svg>
      {xLabels && xLabels.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "var(--gravel)",
            marginTop: 4,
          }}
        >
          {xLabels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
