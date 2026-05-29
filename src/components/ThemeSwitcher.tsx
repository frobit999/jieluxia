"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/AppIcon";
import { DEFAULT_THEME, isThemeId, THEME_STORAGE_KEY, themeOptions, type ThemeId } from "@/lib/themes";

function readCurrentTheme(): ThemeId {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const activeTheme = document.documentElement.dataset.theme ?? null;
  return isThemeId(activeTheme) ? activeTheme : DEFAULT_THEME;
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readCurrentTheme());
  }, []);

  function applyTheme(nextTheme: ThemeId) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <>
      <label
        className="theme-select-mobile sm:hidden flex items-center gap-1 rounded-full px-2"
        style={{
          height: 34,
          background: "var(--color-powder)",
          border: "1px solid var(--color-chalk)",
          color: "var(--color-gravel)",
        }}
        title="切换主题"
      >
        <AppIcon name="palette" size={14} />
        <select
          value={theme}
          aria-label="切换主题"
          onChange={(event) => applyTheme(event.target.value as ThemeId)}
          style={{
            maxWidth: 72,
            background: "transparent",
            border: 0,
            color: "var(--color-obsidian)",
            fontSize: 12,
            outline: "none",
          }}
        >
          {themeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

    <div
      className="theme-switcher hidden sm:flex items-center gap-1 rounded-full p-1"
      style={{
        background: "var(--color-powder)",
        border: "1px solid var(--color-chalk)",
      }}
      aria-label="切换主题"
    >
      <span className="flex h-7 w-7 items-center justify-center" style={{ color: "var(--color-gravel)" }}>
        <AppIcon name="palette" size={14} />
      </span>
      {themeOptions.map((option) => {
        const active = option.id === theme;
        return (
          <button
            key={option.id}
            type="button"
            className="h-7 rounded-full px-2.5 text-[12px] font-medium transition-all"
            style={{
              background: active ? "var(--color-obsidian)" : "transparent",
              color: active ? "var(--color-on-primary)" : "var(--color-gravel)",
              border: "0",
              boxShadow: active ? "var(--shadow-subtle-2)" : "none",
              cursor: "pointer",
              letterSpacing: "0",
            }}
            title={option.description}
            aria-pressed={active}
            onClick={() => applyTheme(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
    </>
  );
}
