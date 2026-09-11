"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { toggleSavedSlug } from "@/lib/saved-deals";

const STORAGE_KEY = "flight-points:saved-deals";
const CHANGE_EVENT = "flight-points:saved-deals-change";

function readSavedSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

// useSyncExternalStore requires a snapshot that's reference-stable when
// nothing changed (an array parsed fresh on every call would never satisfy
// that and could loop) — cache by the raw string and only re-parse when it
// actually differs, same trick the currency store doesn't need for a plain
// string but an array-valued store does.
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
    cachedSnapshot = readSavedSlugs();
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

type SavedDealsContextValue = {
  savedSlugs: string[];
  isSaved: (slug: string) => boolean;
  toggleSaved: (slug: string) => void;
};

const SavedDealsContext = createContext<SavedDealsContextValue | null>(null);

export function SavedDealsProvider({ children }: { children: ReactNode }) {
  const savedSlugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleSaved = useCallback((slug: string) => {
    const next = toggleSavedSlug(readSavedSlugs(), slug);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort persistence only
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo<SavedDealsContextValue>(
    () => ({
      savedSlugs,
      isSaved: (slug: string) => savedSlugs.includes(slug),
      toggleSaved,
    }),
    [savedSlugs, toggleSaved],
  );

  return <SavedDealsContext.Provider value={value}>{children}</SavedDealsContext.Provider>;
}

export function useSavedDeals(): SavedDealsContextValue {
  const ctx = useContext(SavedDealsContext);
  if (!ctx) throw new Error("useSavedDeals must be used within a SavedDealsProvider");
  return ctx;
}
