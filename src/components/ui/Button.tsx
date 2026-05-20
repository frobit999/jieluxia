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
        background: "linear-gradient(135deg, #4ab8ff, #1a6cb4)",
        boxShadow: "0 4px 20px rgba(74, 184, 255, 0.3)",
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
      className={`px-6 py-3.5 rounded-2xl cursor-pointer font-semibold text-sm text-[#7dd4ff] transition-all hover:bg-white/5 ${className}`}
      style={{
        border: "1px solid rgba(74, 184, 255, 0.3)",
        background: "rgba(74, 184, 255, 0.1)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
