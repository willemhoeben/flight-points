"use client";

import { useDictionary } from "@/lib/i18n/i18n-context";
import { useTheme } from "@/lib/theme-context";
import { THEMES, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dict = useDictionary();

  const LABELS: Record<Theme, string> = {
    system: dict.theme.system,
    light: dict.theme.light,
    dark: dict.theme.dark,
  };

  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
      <span className="sr-only">{dict.theme.label}</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="cursor-pointer rounded-full border-0 bg-transparent py-1 pl-0 pr-1 text-xs font-medium text-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {LABELS[t]}
          </option>
        ))}
      </select>
    </label>
  );
}
