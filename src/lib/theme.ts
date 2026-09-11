export type Theme = "light" | "dark" | "system";

export const THEMES: Theme[] = ["system", "light", "dark"];

export const DEFAULT_THEME: Theme = "system";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/** Resolves a theme setting plus the OS-level preference into a concrete light/dark choice. */
export function resolveIsDark(theme: Theme, systemPrefersDark: boolean): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return systemPrefersDark;
}
