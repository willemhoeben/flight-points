"use client";

import { useDictionary } from "@/lib/i18n/i18n-context";
import { useSavedDeals } from "@/lib/saved-deals-context";

export function SaveDealButton({ slug }: { slug: string }) {
  const { isSaved, toggleSaved } = useSavedDeals();
  const dict = useDictionary();
  const saved = isSaved(slug);

  return (
    <button
      type="button"
      onClick={() => toggleSaved(slug)}
      aria-pressed={saved}
      suppressHydrationWarning
      className={
        saved
          ? "inline-flex min-h-11 items-center gap-1.5 bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground print:hidden sm:min-h-0"
          : "inline-flex min-h-11 items-center gap-1.5 bg-surface-muted px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground print:hidden sm:min-h-0"
      }
    >
      <span aria-hidden="true" suppressHydrationWarning>
        {saved ? "★" : "☆"}
      </span>
      <span suppressHydrationWarning>{saved ? dict.dealsPage.savedDeal : dict.dealsPage.saveDeal}</span>
    </button>
  );
}
