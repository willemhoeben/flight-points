import type { Deal } from "@/data/deals";

export type DealSort = "newest" | "expiring";

export function isDealSort(value: string | undefined): value is DealSort {
  return value === "newest" || value === "expiring";
}

/**
 * Sorts a copy of `deals` by publish date (newest first) or by expiry date
 * (soonest first, with non-expiring deals pushed to the end). A null sort
 * returns the input's existing order unchanged. ISO date strings compare
 * correctly with string comparison, so no Date parsing is needed.
 */
export function sortDeals(deals: Deal[], sort: DealSort | null): Deal[] {
  if (sort === "newest") {
    return [...deals].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
  if (sort === "expiring") {
    return [...deals].sort((a, b) => {
      if (!a.expires && !b.expires) return 0;
      if (!a.expires) return 1;
      if (!b.expires) return -1;
      return a.expires.localeCompare(b.expires);
    });
  }
  return deals;
}
