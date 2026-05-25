"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "主页", href: "/dashboard" },
  { label: "打卡", href: "/habits" },
  { label: "数据", href: "/records" },
  { label: "社区", href: "/community" },
  { label: "我的", href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "#ffffff",
        borderTop: "1px solid var(--color-chalk)",
      }}
    >
      <div className="flex justify-around py-2.5">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="no-underline px-3 py-1 text-[12px] transition-colors"
              style={{
                color: active ? "var(--color-obsidian)" : "var(--color-slate)",
                fontWeight: active ? 500 : 400,
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
