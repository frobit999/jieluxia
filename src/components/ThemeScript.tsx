import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/themes";

const themeScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("${THEME_STORAGE_KEY}");
    const theme = ["elevenlabs", "function", "slash"].includes(stored) ? stored : "${DEFAULT_THEME}";
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "${DEFAULT_THEME}";
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
