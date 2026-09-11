"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SavedFilterContextValue = {
  showSavedOnly: boolean;
  toggleShowSavedOnly: () => void;
};

const SavedFilterContext = createContext<SavedFilterContextValue | null>(null);

/**
 * Transient, non-persisted view filter (resets on reload) — unlike
 * saved-deals-context, this never touches localStorage, so its default
 * `false` state is identical on server and client and needs none of the
 * hydration-mismatch handling that a persisted store requires.
 */
export function SavedFilterProvider({ children }: { children: ReactNode }) {
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  return (
    <SavedFilterContext.Provider value={{ showSavedOnly, toggleShowSavedOnly: () => setShowSavedOnly((v) => !v) }}>
      {children}
    </SavedFilterContext.Provider>
  );
}

export function useSavedFilter(): SavedFilterContextValue {
  const ctx = useContext(SavedFilterContext);
  if (!ctx) throw new Error("useSavedFilter must be used within a SavedFilterProvider");
  return ctx;
}
