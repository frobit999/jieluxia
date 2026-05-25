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
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}
