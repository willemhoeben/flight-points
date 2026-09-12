"use client";

import Link from "next/link";
import { formatDateLabel } from "@/lib/format";
import { interpolate } from "@/lib/i18n/format";
import { useDictionary, useLocale } from "@/lib/i18n/i18n-context";
import { useSavedSearches } from "@/lib/saved-searches-context";
import type { SavedSearch } from "@/lib/saved-searches";

function searchHref(search: SavedSearch): string {
  const params = new URLSearchParams();
  params.set("origin", search.origin);
  params.set("destination", search.destination);
  params.set("date", search.date);
  params.set("cabin", search.cabin);
  for (const id of search.programs) params.append("programs", id);
  return `/search?${params.toString()}`;
}

/**
 * Explicit, user-curated complement to SearchMemory's passive "remember the
 * last search" localStorage — same idea as saved deals vs. recently-viewed
 * deals. Renders nothing server-side or with zero saved searches
 * (useSyncExternalStore's server snapshot is []), so there's no
 * server/client existence mismatch to suppress.
 */
export function SavedSearchesList() {
  const { savedSearches, removeSearch } = useSavedSearches();
  const dict = useDictionary();
  const locale = useLocale();

  if (savedSearches.length === 0) return null;

  return (
    <div className="mt-6 print:hidden">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{dict.savedSearches.heading}</div>
      <div className="flex flex-wrap gap-2">
        {savedSearches.map((search) => {
          const label = `${search.origin} → ${search.destination} · ${dict.cabins[search.cabin]} · ${formatDateLabel(search.date, locale)}`;
          return (
            <div
              key={search.id}
              className="inline-flex items-center gap-1 rounded-full bg-surface-muted py-1 pl-3.5 pr-1.5 text-xs font-medium text-muted"
            >
              <Link href={searchHref(search)} className="hover:text-foreground">
                {label}
              </Link>
              <button
                type="button"
                onClick={() => removeSearch(search.id)}
                aria-label={interpolate(dict.savedSearches.removeAria, { search: label })}
                className="rounded-full p-1 hover:bg-surface hover:text-foreground"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
