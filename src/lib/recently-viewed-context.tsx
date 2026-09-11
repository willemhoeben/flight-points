"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { addRecentlyViewed } from "@/lib/recently-viewed";

const STORAGE_KEY = "flight-points:recently-viewed";
const CHANGE_EVENT = "flight-points:recently-viewed-change";

function readRecentSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

// Same array-valued useSyncExternalStore caching trick as saved-deals-context
// — a snapshot parsed fresh on every call would never be reference-stable.
let cachedRaw: string | null = null;
let cachedSnapshot: string[] = [];

function getSnapshot(): string[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = readRecentSlugs();
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

const SERVER_SNAPSHOT: string[] = [];
function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

type RecentlyViewedContextValue = {
  recentSlugs: string[];
  recordView: (slug: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const recentSlugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const recordView = useCallback((slug: string) => {
    const next = addRecentlyViewed(readRecentSlugs(), slug);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort persistence only
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo<RecentlyViewedContextValue>(() => ({ recentSlugs, recordView }), [recentSlugs, recordView]);

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed(): RecentlyViewedContextValue {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  return ctx;
}
