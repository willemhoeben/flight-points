"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  addSavedSearch,
  isSearchSaved,
  removeSavedSearch,
  sanitizeSavedSearches,
  type SavedSearch,
  type SavedSearchInput,
} from "@/lib/saved-searches";

const STORAGE_KEY = "flight-points:saved-searches";
const CHANGE_EVENT = "flight-points:saved-searches-change";

function readSavedSearches(): SavedSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return sanitizeSavedSearches(parsed);
  } catch {
    return [];
  }
}

// Same array-valued useSyncExternalStore caching trick as saved-deals-context
// and recently-viewed-context — a snapshot parsed fresh on every call would
// never be reference-stable.
let cachedRaw: string | null = null;
let cachedSnapshot: SavedSearch[] = [];

function getSnapshot(): SavedSearch[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = readSavedSearches();
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

const SERVER_SNAPSHOT: SavedSearch[] = [];
function getServerSnapshot(): SavedSearch[] {
  return SERVER_SNAPSHOT;
}

type SavedSearchesContextValue = {
  savedSearches: SavedSearch[];
  isSaved: (params: { origin: string; destination: string; date: string; cabin: SavedSearchInput["cabin"] }) => boolean;
  saveSearch: (entry: SavedSearchInput) => void;
  removeSearch: (id: string) => void;
};

const SavedSearchesContext = createContext<SavedSearchesContextValue | null>(null);

export function SavedSearchesProvider({ children }: { children: ReactNode }) {
  const savedSearches = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const saveSearch = useCallback((entry: SavedSearchInput) => {
    const next = addSavedSearch(readSavedSearches(), entry);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort persistence only
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const removeSearch = useCallback((id: string) => {
    const next = removeSavedSearch(readSavedSearches(), id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort persistence only
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo<SavedSearchesContextValue>(
    () => ({
      savedSearches,
      isSaved: (params) => isSearchSaved(savedSearches, params),
      saveSearch,
      removeSearch,
    }),
    [savedSearches, saveSearch, removeSearch],
  );

  return <SavedSearchesContext.Provider value={value}>{children}</SavedSearchesContext.Provider>;
}

export function useSavedSearches(): SavedSearchesContextValue {
  const ctx = useContext(SavedSearchesContext);
  if (!ctx) throw new Error("useSavedSearches must be used within a SavedSearchesProvider");
  return ctx;
}
