"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_THEME, isTheme, resolveIsDark, type Theme } from "@/lib/theme";

const STORAGE_KEY = "flight-points:theme";
const CHANGE_EVENT = "flight-points:theme-change";

function readStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isTheme(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

// Cross-tab sync via the native "storage" event, same-tab sync via a custom
// event dispatched from setTheme (native "storage" only fires in OTHER
// tabs, never the one that made the write) — same pattern as currency-context.
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// SSR and the pre-hydration client render can't read localStorage — always
// "system" there, same reconciliation trick as currency-context.
function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

// Applies (or removes) the "dark" class the blocking inline script in
// layout.tsx already set pre-hydration — keeps the DOM in sync on every
// later change without a page reload. See globals.css's @custom-variant.
// Also re-syncs the theme-color meta tag from the (now-updated) CSS custom
// property, so the mobile browser chrome tracks a live theme change too.
function applyThemeClass(theme: Theme) {
  const isDark = resolveIsDark(theme, window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
  const background = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
  if (background) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", background);
  }
}

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readStoredTheme, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // best-effort persistence only
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  useEffect(() => {
    applyThemeClass(theme);
    if (theme !== "system") return;

    // Live-follow OS-level changes while the user hasn't overridden it.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeClass(theme);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
