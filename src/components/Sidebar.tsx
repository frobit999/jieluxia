"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const navItems = [
  { icon: "📊", label: "仪表盘", href: "/dashboard" },
  { icon: "📅", label: "打卡记录", href: "/records" },
  { icon: "💬", label: "社区交流", href: "/community" },
  { icon: "⚙️", label: "设置", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="hidden lg:flex w-[220px] py-8 px-4 flex-col gap-2 flex-shrink-0">
      <div className="mb-6 pl-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg"
            style={{
              background: "linear-gradient(135deg, #4dc9f6, #ff6eb4)",
            }}
          >
            🛡️
          </div>
          <div>
            <div className="font-bold text-[15px] text-[#e8f4ff]">戒撸侠</div>
            <div className="text-[11px] text-[rgba(200,220,255,0.5)]">
              自律成就未来
            </div>
          </div>
        </div>
      </div>

      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3.5 py-2.5 rounded-[14px] no-underline flex items-center gap-2.5 text-sm transition-all ${
              active ? "glass-pill text-[#4dc9f6]" : "text-[rgba(200,220,255,0.5)] hover:text-[rgba(200,220,255,0.7)]"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div className="flex-1" />

      <div className="glass-card p-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm mb-2"
          style={{
            background: "linear-gradient(135deg, #4dc9f6, #ff6eb4)",
          }}
        >
          {user?.avatarEmoji ?? "👤"}
        </div>
        <div className="text-[13px] font-semibold text-[rgba(200,220,255,0.85)]">
          {user?.nickname ?? "加载中..."}
        </div>
        <div className="text-[11px] text-[rgba(200,220,255,0.5)] mt-0.5">
          {user ? `Lv.${user.level} · ${user.title}` : "Lv.1 · 新人"}
        </div>
      </div>
    </div>
  );
}
