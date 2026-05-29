"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const navItems = [
  { label: "仪表盘", href: "/dashboard" },
  { label: "打卡记录", href: "/records" },
  { label: "社区交流", href: "/community" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "var(--color-eggshell)",
        borderBottom: "1px solid var(--color-chalk)",
        height: "56px",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between h-full"
        style={{ maxWidth: "1200px", padding: "0 24px" }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="no-underline flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-obsidian)" }}
          >
            <span style={{ color: "var(--color-eggshell)", fontSize: "11px", fontWeight: 500 }}>戒</span>
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: "var(--color-obsidian)",
            }}
          >
            岁月清风
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="no-underline px-3.5 py-1.5 rounded-full text-[13px] transition-colors"
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
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="no-underline flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: pathname === "/settings" ? "var(--color-powder)" : "transparent",
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
              style={{ background: "var(--color-obsidian)" }}
            >
              <span style={{ color: "var(--color-eggshell)" }}>{user?.avatarEmoji ?? "👤"}</span>
            </div>
            <span className="hidden sm:inline text-[13px] font-medium" style={{ color: "var(--color-obsidian)" }}>
              {user?.nickname ?? ""}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
