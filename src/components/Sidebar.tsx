"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const navItems = [
  { label: "仪表盘", href: "/dashboard" },
  { label: "打卡记录", href: "/records" },
  { label: "社区交流", href: "/community" },
  { label: "设置", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div
      className="hidden lg:flex w-[220px] py-8 px-5 flex-col gap-1 flex-shrink-0"
      style={{ borderRight: "1px solid var(--color-chalk)" }}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "var(--color-obsidian)" }}>
            <span style={{ color: "var(--color-eggshell)" }}>戒</span>
          </div>
          <div>
            <div className="font-medium text-[15px]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--color-obsidian)" }}>戒撸侠</div>
          </div>
        </div>
      </div>

      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-lg no-underline flex items-center text-[14px] transition-colors"
            style={{
              color: active ? "var(--color-obsidian)" : "var(--color-gravel)",
              background: active ? "var(--color-powder)" : "transparent",
              fontWeight: active ? 500 : 400,
              letterSpacing: "0.01em",
            }}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="flex-1" />

      <div
        className="p-4 rounded-xl"
        style={{ background: "var(--color-powder)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm mb-2"
          style={{ background: "var(--color-obsidian)" }}
        >
          <span style={{ color: "var(--color-eggshell)" }}>{user?.avatarEmoji ?? "👤"}</span>
        </div>
        <div className="text-[13px] font-medium" style={{ color: "var(--color-obsidian)" }}>
          {user?.nickname ?? "加载中..."}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: "var(--color-gravel)" }}>
          {user ? `Lv.${user.level} · ${user.title}` : "Lv.1 · 新人"}
        </div>
      </div>
    </div>
  );
}
