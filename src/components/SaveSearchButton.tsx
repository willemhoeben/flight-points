"use client";

import type { Cabin } from "@/data/availability";
import { useDictionary } from "@/lib/i18n/i18n-context";
import { useSavedSearches } from "@/lib/saved-searches-context";

export function SaveSearchButton({
  search,
}: {
  search: { origin: string; destination: string; date: string; cabin: Cabin; programs: string[] };
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
          ? "inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground print:hidden"
          : "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand print:hidden"
      }
    >
      <span aria-hidden="true" suppressHydrationWarning>
        {saved ? "★" : "☆"}
      </span>
      <span suppressHydrationWarning>{saved ? dict.savedSearches.saved : dict.savedSearches.save}</span>
    </button>
  );
}
