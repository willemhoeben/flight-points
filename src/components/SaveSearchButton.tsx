"use client";

import type { SavedSearchInput } from "@/lib/saved-searches";
import { useDictionary } from "@/lib/i18n/i18n-context";
import { useSavedSearches } from "@/lib/saved-searches-context";

export function SaveSearchButton({
  search,
}: {
  search: SavedSearchInput;
}) {
  const { isSaved, saveSearch } = useSavedSearches();
  const dict = useDictionary();
  const saved = isSaved(search);

  return (
    <button
      type="button"
      onClick={() => saveSearch(search)}
      aria-pressed={saved}
      suppressHydrationWarning
      className={
        saved
          ? "inline-flex min-h-11 items-center gap-1.5 bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground print:hidden sm:min-h-0"
          : "inline-flex min-h-11 items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand-text print:hidden sm:min-h-0"
      }
    >
      <span aria-hidden="true" suppressHydrationWarning>
        {saved ? "★" : "☆"}
      </span>
      <span suppressHydrationWarning>{saved ? dict.savedSearches.saved : dict.savedSearches.save}</span>
    </button>
  );
}
