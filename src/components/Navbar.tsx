"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/AppIcon";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useUser } from "@/hooks/useUser";

const navItems = [
  { label: "仪表盘", href: "/dashboard", icon: "dashboard" },
  { label: "打卡记录", href: "/records", icon: "calendar" },
  { label: "社区交流", href: "/community", icon: "community" },
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
            <span style={{ color: "var(--color-eggshell)", display: "flex" }}>
              <AppIcon name="wind" size={14} strokeWidth={2} />
            </span>
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
                className="no-underline px-3.5 py-1.5 rounded-full text-[13px] transition-colors inline-flex items-center gap-1.5"
                style={{
                  color: active ? "var(--color-obsidian)" : "var(--color-gravel)",
                  background: active ? "var(--color-powder)" : "transparent",
                  fontWeight: active ? 500 : 400,
                  letterSpacing: "0.01em",
                }}
              >
                <AppIcon name={item.icon} size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
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
              <span style={{ color: "var(--color-eggshell)", display: "flex" }}>
                <AppIcon name={user?.avatarEmoji ?? "user"} size={13} />
              </span>
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
