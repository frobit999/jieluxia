export const THEME_STORAGE_KEY = "jieluxia-theme";

export const themeOptions = [
  { id: "elevenlabs", label: "Eleven", description: "Editorial light" },
  { id: "function", label: "Function", description: "Warm clinical" },
  { id: "slash", label: "Slash", description: "Dark finance" },
] as const;

export type ThemeId = (typeof themeOptions)[number]["id"];

export const DEFAULT_THEME: ThemeId = "elevenlabs";

export function isThemeId(value: string | null): value is ThemeId {
  return themeOptions.some((theme) => theme.id === value);
}
