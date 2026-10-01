"use client";

import { useDictionary } from "@/lib/i18n/i18n-context";
import { BARE_SELECT } from "@/components/ui";
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
        className={BARE_SELECT}
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
