"use client";

import { useSavedFilter } from "@/lib/saved-filter-context";

export function SavedOnlyPill({ label }: { label: string }) {
  const { showSavedOnly, toggleShowSavedOnly } = useSavedFilter();

  return (
    <button
      type="button"
      aria-pressed={showSavedOnly}
      onClick={toggleShowSavedOnly}
      className={
        showSavedOnly
          ? "bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
          : "bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
      }
    >
      ★ {label}
    </button>
  );
}
