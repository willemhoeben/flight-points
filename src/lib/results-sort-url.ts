import type { SortDir } from "@/lib/sort";

export type ResultsSortKey = "milesCost" | "durationMinutes" | "seatsRemaining";

export const DEFAULT_RESULTS_SORT_KEY: ResultsSortKey = "milesCost";
export const DEFAULT_RESULTS_SORT_DIR: SortDir = "asc";

export function isResultsSortKey(value: string | null): value is ResultsSortKey {
  return value === "milesCost" || value === "durationMinutes" || value === "seatsRemaining";
}

/**
 * Builds the shareable results URL for a given sort state, preserving every
 * other existing query param (origin/destination/date/cabin/programs) and
 * omitting sort/dir when they're at their default — so a plain search only
 * ever picks up `?sort=&dir=` once the visitor actually changes the sort.
 */
export function buildResultsSortUrl(
  pathname: string,
  currentSearch: string,
  sort: { sortKey: ResultsSortKey; sortDir: SortDir },
): string {
  const params = new URLSearchParams(currentSearch);
  const isDefaultSort = sort.sortKey === DEFAULT_RESULTS_SORT_KEY && sort.sortDir === DEFAULT_RESULTS_SORT_DIR;
  if (isDefaultSort) {
    params.delete("sort");
    params.delete("dir");
  } else {
    params.set("sort", sort.sortKey);
    params.set("dir", sort.sortDir);
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
