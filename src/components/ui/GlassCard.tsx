import { type ReactNode } from "react";

export function GlassCard({
  children,
  strong = false,
  className = "",
}: {
  children: ReactNode;
  strong?: boolean;
  className?: string;
}) {
  return (
    <div className={`${strong ? "glass-strong" : "glass-card"} ${className}`}>
      {children}
    </div>
  );
}
