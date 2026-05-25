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
          stroke="var(--color-chalk)"
          strokeWidth="6"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-obsidian)"
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: "var(--color-obsidian)", letterSpacing: "-0.02em" }}>
          {days}
        </span>
        <span className="text-[11px] mt-0.5" style={{ color: "var(--color-gravel)" }}>
          {label}
        </span>
      </div>
    </div>
  );
}
