"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "home", label: "主页", href: "/dashboard" },
  { id: "stats", label: "数据", href: "/records" },
  { id: "community", label: "社区", href: "/community" },
  { id: "me", label: "我的", href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "#ffffff",
        borderTop: "1px solid var(--color-chalk)",
      }}
    >
      <div className="flex justify-around py-2.5 px-2">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.id}
              href={t.href}
              className="flex flex-col items-center gap-0.5 no-underline px-3 py-1 rounded-lg transition-colors"
            >
              <span
                className="text-[11px]"
                style={{
                  color: active ? "var(--color-obsidian)" : "var(--color-gravel)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
