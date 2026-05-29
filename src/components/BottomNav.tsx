"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/AppIcon";

const tabs = [
  { label: "主页", href: "/dashboard", icon: "home" },
  { label: "数据", href: "/records", icon: "calendar" },
  { label: "社区", href: "/community", icon: "community" },
  { label: "我的", href: "/settings", icon: "user" },
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
              className="no-underline px-3 py-1 text-[12px] transition-colors inline-flex flex-col items-center gap-1"
              style={{
                color: active ? "var(--color-obsidian)" : "var(--color-slate)",
                fontWeight: active ? 500 : 400,
              }}
            >
              <AppIcon name={t.icon} size={17} strokeWidth={active ? 2 : 1.7} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
