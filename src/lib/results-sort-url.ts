import type { SortDir } from "@/lib/sort";

export type ResultsSortKey = "milesCost" | "durationMinutes" | "seatsRemaining";

export const DEFAULT_RESULTS_SORT_KEY: ResultsSortKey = "milesCost";
export const DEFAULT_RESULTS_SORT_DIR: SortDir = "asc";

export function isResultsSortKey(value: string | null): value is ResultsSortKey {
  return value === "milesCost" || value === "durationMinutes" || value === "seatsRemaining";
}

export function isNonstopOnlyParam(value: string | null): boolean {
  return value === "1";
}

/**
 * Builds the shareable results URL for a given sort/filter state, preserving
 * every other existing query param (origin/destination/date/cabin/programs)
 * and omitting sort/dir/nonstop when they're at their default — so a plain
 * search only ever picks up these params once the visitor actually changes
 * the view.
 */
export function buildResultsSortUrl(
  pathname: string,
  currentSearch: string,
  view: { sortKey: ResultsSortKey; sortDir: SortDir; nonstopOnly: boolean },
): string {
  const params = new URLSearchParams(currentSearch);
  const isDefaultSort = view.sortKey === DEFAULT_RESULTS_SORT_KEY && view.sortDir === DEFAULT_RESULTS_SORT_DIR;
  if (isDefaultSort) {
    params.delete("sort");
    params.delete("dir");
  } else {
    params.set("sort", view.sortKey);
    params.set("dir", view.sortDir);
  }
  if (view.nonstopOnly) {
    params.set("nonstop", "1");
  } else {
    params.delete("nonstop");
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
