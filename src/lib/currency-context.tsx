"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_CURRENCY, formatCurrency, isCurrencyCode, type CurrencyCode } from "@/lib/currency";

const STORAGE_KEY = "flight-points:currency";
const CHANGE_EVENT = "flight-points:currency-change";

function readStoredCurrency(): CurrencyCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isCurrencyCode(saved) ? saved : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
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

// SSR and the pre-hydration client render can't read localStorage — always
// USD there. useSyncExternalStore reconciles the mismatch after hydration
// without the setState-in-effect anti-pattern a plain useState+useEffect
// version would need.
function getServerSnapshot(): CurrencyCode {
  return DEFAULT_CURRENCY;
}

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountUsd: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = useSyncExternalStore(subscribe, readStoredCurrency, getServerSnapshot);

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
      format: (amountUsd: number) => formatCurrency(amountUsd, currency),
    }),
    [currency, setCurrency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
