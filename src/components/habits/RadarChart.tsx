"use client";
import { useMemo } from "react";

interface RadarDatum { habitId: string; name: string; color: string; todayPct: number; weekPct: number; }
interface Props { data: RadarDatum[]; onAxisClick?: (habitId: string) => void; }

const CX = 200, CY = 200, R = 140, N = 7;
function axisPoint(index: number, radius: number) {
  const angle = (2 * Math.PI * index) / N - Math.PI / 2;
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
}
function polyPoints(pcts: number[], radius: number) {
  return pcts.map((pct, i) => { const p = axisPoint(i, (radius * Math.min(pct, 100)) / 100); return `${p.x},${p.y}`; }).join(" ");
}

export default function RadarChart({ data, onAxisClick }: Props) {
  const gridLevels = useMemo(() => [0.25, 0.5, 0.75, 1.0], []);
  const gridPolygons = useMemo(() => gridLevels.map((lvl) => Array.from({ length: N }, (_, i) => axisPoint(i, R * lvl)).map((p) => `${p.x},${p.y}`).join(" ")), [gridLevels]);
  const spokes = useMemo(() => Array.from({ length: N }, (_, i) => axisPoint(i, R)), []);
  const todayPts = polyPoints(data.map((d) => d.todayPct), R);
  const weekPts = polyPoints(data.map((d) => d.weekPct), R);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <svg viewBox="0 0 400 420" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
        {spokes.map((p, i) => <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="var(--color-chalk)" strokeWidth={1} />)}
        {gridPolygons.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke="var(--color-chalk)" strokeWidth={1} />)}
        <polygon points={weekPts} fill="none" stroke="var(--color-slate)" strokeWidth={1.5} strokeLinejoin="round" strokeDasharray="4 3" />
        <polygon points={todayPts} fill="rgba(0,0,0,0.04)" stroke="var(--color-obsidian)" strokeWidth={2} strokeLinejoin="round" />
        {data.map((d, i) => {
          const outer = axisPoint(i, R);
          const labelPos = axisPoint(i, R + 26);
          const angle = (2 * Math.PI * i) / N - Math.PI / 2;
          const angleDeg = ((angle * 180) / Math.PI + 360) % 360;
          let anchor: "start" | "middle" | "end" = "middle";
          if (angleDeg > 20 && angleDeg < 160) anchor = "start";
          else if (angleDeg > 200 && angleDeg < 340) anchor = "end";
          return (
            <g key={d.habitId}>
              <circle cx={outer.x} cy={outer.y} r={13} fill="var(--color-card-strong)" stroke="var(--color-chalk)" strokeWidth={1} style={{ cursor: onAxisClick ? "pointer" : "default" }} onClick={() => onAxisClick?.(d.habitId)} />
              <text x={outer.x} y={outer.y} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={500} fill="var(--color-obsidian)" style={{ pointerEvents: "none" }}>{d.todayPct}</text>
              <text x={labelPos.x} y={labelPos.y} textAnchor={anchor} dominantBaseline="central" fontSize={11} fill="var(--color-gravel)" style={{ pointerEvents: "none" }}>{d.name}</text>
            </g>
          );
        })}
        <g transform="translate(200, 406)">
          <line x1={-50} y1={0} x2={-34} y2={0} stroke="var(--color-obsidian)" strokeWidth={2} />
          <text x={-30} y={1} dominantBaseline="central" fontSize={11} fill="var(--color-gravel)">今日</text>
          <line x1={14} y1={0} x2={30} y2={0} stroke="var(--color-slate)" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={34} y={1} dominantBaseline="central" fontSize={11} fill="var(--color-gravel)">本周</text>
        </g>
      </svg>
    </div>
  );
}
