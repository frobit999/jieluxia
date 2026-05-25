"use client";

import { type ReactNode, type ButtonHTMLAttributes } from "react";

export function PrimaryButton({
  children,
  className = "",
  ...props
}: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 h-9 rounded-full border-none cursor-pointer font-medium text-sm text-[#fdfcfc] transition-all hover:opacity-90 active:scale-[0.98] ${className}`}
      style={{
        background: "var(--color-obsidian)",
        boxShadow: "var(--shadow-subtle-2)",
        letterSpacing: "0.01em",
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
      className={`inline-flex items-center justify-center px-3 h-9 rounded-full cursor-pointer font-medium text-sm transition-all hover:bg-[var(--color-powder)] ${className}`}
      style={{
        background: "#ffffff",
        color: "var(--color-obsidian)",
        border: "1px solid var(--color-chalk)",
        boxShadow: "var(--shadow-subtle-2)",
        letterSpacing: "0.01em",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
