"use client";

import { type ReactNode, type ButtonHTMLAttributes } from "react";

export function PrimaryButton({
  children,
  className = "",
  ...props
}: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-8 py-3 rounded-[14px] border-none cursor-pointer font-bold text-[15px] tracking-[0.3px] text-white transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{
        background: "linear-gradient(135deg, #4dc9f6, #ff6eb4)",
        boxShadow: "0 4px 24px rgba(77, 201, 246, 0.25), 0 2px 12px rgba(255, 110, 180, 0.2)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-6 py-3.5 rounded-2xl cursor-pointer font-semibold text-sm text-[#4dc9f6] transition-all hover:bg-white/5 ${className}`}
      style={{
        border: "1px solid rgba(77, 201, 246, 0.25)",
        background: "rgba(77, 201, 246, 0.08)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
