"use client";

import { useId } from "react";

export function StreakRing({
  days,
  label = "天",
  goalDays = 90,
}: {
  days: number;
  label?: string;
  goalDays?: number;
}) {
  const id = useId();
  const gradId = `arcGrad-${id}`;
  const r = 54;
  const cx = 64;
  const cy = 64;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(days / goalDays, 1);
  const dash = circ * pct;

  return (
    <div style={{ position: "relative", width: "128px", height: "128px", flexShrink: 0 }}>
      <svg
        width="128"
        height="128"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-chalk)"
          strokeWidth="5"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-obsidian)"
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            lineHeight: 1,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            color: "var(--color-obsidian)",
            letterSpacing: "-0.64px",
          }}
        >
          {days}
        </span>
        <span style={{ fontSize: "12px", marginTop: "4px", color: "var(--color-gravel)" }}>
          {label}
        </span>
      </div>
    </div>
  );
}
