"use client";

import { type ReactNode } from "react";

export function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 flex items-end z-[100]"
      style={{
        background: "rgba(5, 15, 26, 0.7)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="glass-strong w-full rounded-t-[28px] px-6 pt-7 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-9 h-1 mx-auto mb-6 rounded"
          style={{ background: "rgba(255, 255, 255, 0.2)" }}
        />
        {children}
      </div>
    </div>
  );
}
