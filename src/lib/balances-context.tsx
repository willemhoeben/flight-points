"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { normalizeBalances, type Balances } from "@/lib/wallet";

const STORAGE_KEY = "flight-points:balances";
const CHANGE_EVENT = "flight-points:balances-change";

function readBalances(): Balances {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return normalizeBalances(raw ? JSON.parse(raw) : {});
  } catch {
    return {};
  }
}

// useSyncExternalStore needs a snapshot that keeps its identity while
// nothing has changed, and an object parsed fresh on every call never
// would. Cache by the raw string and only re-parse when it actually
// differs, the same trick the saved-deals store uses for its array.
let cachedRaw: string | null = null;
let cachedSnapshot: Balances = {};

function getSnapshot(): Balances {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = readBalances();
  }
  return cachedSnapshot;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

const SERVER_SNAPSHOT: Balances = {};
function getServerSnapshot(): Balances {
  return SERVER_SNAPSHOT;
}

type BalancesContextValue = {
  balances: Balances;
  /** A count of 0 or less removes the currency rather than storing a zero. */
  setBalance: (currencyId: string, amount: number) => void;
  clearAll: () => void;
};

const BalancesContext = createContext<BalancesContextValue | null>(null);

export function BalancesProvider({ children }: { children: ReactNode }) {
  const balances = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const write = useCallback((next: Balances) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort persistence only: a private window with storage blocked
      // still gets a working page for this visit
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const setBalance = useCallback(
    (currencyId: string, amount: number) => {
      const next = { ...readBalances() };
      if (Number.isFinite(amount) && amount > 0) next[currencyId] = Math.round(amount);
      else delete next[currencyId];
      write(next);
    },
    [write],
  );

  const clearAll = useCallback(() => write({}), [write]);

  const value = useMemo<BalancesContextValue>(
    () => ({ balances, setBalance, clearAll }),
    [balances, setBalance, clearAll],
  );

  return <BalancesContext.Provider value={value}>{children}</BalancesContext.Provider>;
}

export function useBalances(): BalancesContextValue {
  const ctx = useContext(BalancesContext);
  if (!ctx) throw new Error("useBalances must be used within a BalancesProvider");
  return ctx;
}
