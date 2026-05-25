export interface TrendPoint {
  label: string;
  date: string;
  value: number;
}

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

export function getWeeklyTrend(history: Map<string, number>, today: string): TrendPoint[] {
  const [y, m, d] = today.split("-").map(Number);
  const todayDate = new Date(y, m - 1, d);
  const points: TrendPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(todayDate);
    dt.setDate(dt.getDate() - i);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    points.push({
      label: WEEKDAY[dt.getDay()],
      date: key,
      value: history.get(key) ?? 0,
    });
  }
  return points;
}

export function scaleTrendPoints(points: TrendPoint[], targetMax: number): number[] {
  const rawMax = Math.max(...points.map((p) => p.value), 1);
  return points.map((p) => Math.round((p.value / rawMax) * targetMax));
}

export function computeSmoothPath(values: number[], chartHeight: number, maxValue: number): string {
  if (values.length === 0) return "";
  const xStep = 300 / (values.length - 1);
  const scale = maxValue > 0 ? chartHeight / maxValue : 1;
  const pts = values.map((v, i) => ({ x: Math.round(i * xStep), y: Math.round(chartHeight - v * scale) }));

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = Math.round(pts[i].x + xStep * 0.35);
    const cp2x = Math.round(pts[i + 1].x - xStep * 0.35);
    d += ` C ${cp1x} ${pts[i].y} ${cp2x} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}
