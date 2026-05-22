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
    <div className="relative w-[128px] h-[128px]">
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
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="8"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4dc9f6" />
            <stop offset="100%" stopColor="#ff6eb4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-bold text-[#e8f4ff] tracking-tight leading-none neon-blue">
          {days}
        </span>
        <span className="text-[11px] text-[rgba(200,220,255,0.7)] mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}
