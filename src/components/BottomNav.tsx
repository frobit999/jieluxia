"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "home", icon: "🏠", label: "主页", href: "/dashboard" },
  { id: "stats", icon: "📊", label: "数据", href: "/records" },
  { id: "community", icon: "👥", label: "社区", href: "/community" },
  { id: "me", icon: "👤", label: "我的", href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-5">
      <div className="glass-card px-2 py-2.5 flex justify-around">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.id}
              href={t.href}
              className="flex flex-col items-center gap-1 no-underline px-3 py-1 rounded-[14px] transition-all"
              style={{
                background: active ? "rgba(77, 201, 246, 0.12)" : "transparent",
              }}
            >
              <span className="text-xl">{t.icon}</span>
              <span
                className="text-[10px]"
                style={{
                  color: active ? "#4dc9f6" : "rgba(200, 220, 255, 0.4)",
                  fontWeight: active ? 600 : 400,
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
