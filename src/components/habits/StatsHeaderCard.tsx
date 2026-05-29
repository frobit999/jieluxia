"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, Clock3, Flame } from "lucide-react";
import { formatDate } from "@/lib/habits";

interface Props { history: Map<string, number>; streak: number; totalCheckins: number; totalDays: number; onClick: () => void; }

const WEEKDAY_ZH = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function StatsHeaderCard({ history, streak, totalCheckins, totalDays, onClick }: Props) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    const onVis = () => { if (document.visibilityState === "visible") setNow(new Date()); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const todayStr = formatDate(now);
  const todayDate = now.getDate();
  const weekdayIdx = (now.getDay() + 6) % 7;
  const todayCount = history.get(todayStr) ?? 0;

  return (
    <div className="card" style={{ cursor: "pointer", padding: "20px 24px" }} onClick={onClick}>
      <div style={{ fontSize: 11, color: "var(--color-gravel)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {todayCount} 次打卡, Today
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ textAlign: "center", minWidth: 48 }}>
          <div style={{ fontSize: 12, color: "var(--color-gravel)" }}>{WEEKDAY_ZH[weekdayIdx]}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.72px", color: "var(--color-obsidian)" }}>{todayDate}</div>
          <div style={{ fontSize: 12, color: "var(--color-gravel)" }}>{MONTH_EN[now.getMonth()]}</div>
        </div>
        <div style={{ width: 1, height: 48, background: "var(--color-chalk)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {[{ Icon: Flame, text: `连续 ${streak} 天` },
            { Icon: CheckCircle2, text: `累计 ${totalCheckins} 次` },
            { Icon: Clock3, text: `活跃 ${totalDays} 天` }].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-obsidian)" }}>
              <item.Icon size={16} strokeWidth={1.8} />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
