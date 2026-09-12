import type { PointCurrency } from "@/data/valuations";
import type { SortDir } from "@/lib/sort";

export { isSortDir } from "@/lib/sort";

export type ValuationsSortKey = "name" | "centsPerPoint";
export type ValuationsTypeFilter = PointCurrency["type"] | null;

export const DEFAULT_VALUATIONS_SORT_KEY: ValuationsSortKey = "centsPerPoint";
export const DEFAULT_VALUATIONS_SORT_DIR: SortDir = "desc";

export function isValuationType(value: string | null): value is PointCurrency["type"] {
  return value === "bank" || value === "airline" || value === "hotel";
}

export function isValuationsSortKey(value: string | null): value is ValuationsSortKey {
  return value === "name" || value === "centsPerPoint";
}

/**
 * Builds the shareable URL for a given filter/sort state, omitting any
 * param that's at its default value — so the plain default state
 * (no type filter, sorted by value descending) always resolves to a bare
 * "/valuations" with no query string, and only genuine customization
 * shows up in the URL.
 */
export function buildValuationsUrl(
  pathname: string,
  state: { type: ValuationsTypeFilter; sortKey: ValuationsSortKey; sortDir: SortDir },
): string {
  const params = new URLSearchParams();
  if (state.type) params.set("type", state.type);
  const isDefaultSort = state.sortKey === DEFAULT_VALUATIONS_SORT_KEY && state.sortDir === DEFAULT_VALUATIONS_SORT_DIR;
  if (!isDefaultSort) {
    params.set("sort", state.sortKey);
    params.set("dir", state.sortDir);
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
