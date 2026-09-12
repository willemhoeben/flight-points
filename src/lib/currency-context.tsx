"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { defaultCurrencyForLocale, formatCurrency, isCurrencyCode, type CurrencyCode } from "@/lib/currency";
import { useLocale } from "@/lib/i18n/i18n-context";
import type { Locale } from "@/lib/i18n/locales";

const STORAGE_KEY = "flight-points:currency";
const CHANGE_EVENT = "flight-points:currency-change";

function readStoredCurrency(locale: Locale): CurrencyCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isCurrencyCode(saved) ? saved : defaultCurrencyForLocale(locale);
  } catch {
    return defaultCurrencyForLocale(locale);
  }
}

// Cross-tab sync via the native "storage" event, same-tab sync via a custom
// event dispatched from setCurrency (native "storage" only fires in OTHER
// tabs, never the one that made the write).
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountUsd: number) => string;
  /** Same conversion, cents dropped — for coarse threshold labels. */
  formatRounded: (amountUsd: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  // locale is already known server-side (the cookie/Accept-Language
  // resolution in get-dictionary.ts), so the "pre-localStorage" default can
  // be locale-correct from the very first server-rendered byte — no flash,
  // and no hydration mismatch: useSyncExternalStore calls getServerSnapshot
  // during the hydration-matching pass and only switches to getSnapshot
  // (which can then pick up a real localStorage override) afterward.
  const getSnapshot = useCallback(() => readStoredCurrency(locale), [locale]);
  const getServerSnapshot = useCallback(() => defaultCurrencyForLocale(locale), [locale]);
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCurrency = useCallback((code: CurrencyCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // best-effort persistence only
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      format: (amountUsd: number) => formatCurrency(amountUsd, currency, locale),
      formatRounded: (amountUsd: number) => formatCurrency(amountUsd, currency, locale, { round: true }),
    }),
    [currency, setCurrency, locale],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
