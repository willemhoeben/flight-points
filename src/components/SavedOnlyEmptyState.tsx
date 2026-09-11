"use client";

import { useSavedDeals } from "@/lib/saved-deals-context";
import { useSavedFilter } from "@/lib/saved-filter-context";

export function SavedOnlyEmptyState({ slugs, message }: { slugs: string[]; message: string }) {
  const { isSaved } = useSavedDeals();
  const { showSavedOnly } = useSavedFilter();

  if (!showSavedOnly || slugs.some(isSaved)) return null;
  return <div className="mt-8 rounded-[20px] bg-surface-muted p-10 text-center text-sm text-muted">{message}</div>;
}
