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
        background: "rgba(0, 0, 0, 0.3)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full px-6 pt-7 pb-10"
        style={{
          background: "var(--color-card)",
          borderTopLeftRadius: "var(--radius-sheet)",
          borderTopRightRadius: "var(--radius-sheet)",
          boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-9 h-1 mx-auto mb-6 rounded-full"
          style={{ background: "var(--color-chalk)" }}
        />
        {children}
      </div>
    </div>
  );
}
