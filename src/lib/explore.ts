import { AIRPORTS, type Airport } from "@/data/airports";
import { searchAvailability, type AwardResult, type Cabin } from "@/data/availability";
import { addDays } from "@/lib/format";

/** How many days forward the calendar strip and the explore scan both look. */
export const EXPLORE_DAYS = 14;

export type ExploreDestination = {
  airport: Airport;
  /** The cheapest award found for this destination inside the window. */
  best: AwardResult & { date: string };
};

/**
 * Answers the question people actually start with: "I have this many points,
 * where can I go?"
 *
 * Search prices one route; this scans every destination across the calendar
 * window and keeps the cheapest award it finds for each. It honours the
 * program filter, so if you have narrowed to Star Alliance the destinations
 * you are shown are ones you could actually book.
 *
 * The budget filter deliberately lives in the caller, not here, so a page can
 * say "18 of 24 destinations" without scanning twice.
 */
export function exploreDestinations(params: {
  origin: string;
  cabin: Cabin;
  startDate: string;
  programIds?: string[];
  days?: number;
  /**
   * Seats the party needs. Award space is sold per seat, so without this a
   * family of four is shown destinations the search then says are not
   * bookable, which is the one thing a "where can I go" page must not do.
   */
  minSeats?: number;
}): ExploreDestination[] {
  const { origin, cabin, startDate, programIds, days = EXPLORE_DAYS, minSeats = 1 } = params;
  const out: ExploreDestination[] = [];

  for (const airport of AIRPORTS) {
    if (airport.code === origin) continue;

    let best: (AwardResult & { date: string }) | null = null;
    for (let i = 0; i < days; i++) {
      const date = addDays(startDate, i);
      const results = searchAvailability({ origin, destination: airport.code, date, cabin, programIds });
      const top = results.find((r) => r.seatsRemaining >= minSeats);
      if (!top) continue;
      if (!best || top.milesCost < best.milesCost) best = { ...top, date };
    }

    if (best) out.push({ airport, best });
  }

  return out.sort((a, b) => a.best.milesCost - b.best.milesCost);
}

export type ExploreSort = "cheapest" | "value";

export function isExploreSort(value: string | undefined): value is ExploreSort {
  return value === "cheapest" || value === "value";
}

/**
 * Cheapest answers "what can I afford"; best value answers "where are my
 * points worth the most", which is a different trip entirely.
 */
export function sortDestinations(rows: ExploreDestination[], sort: ExploreSort): ExploreDestination[] {
  if (sort === "cheapest") return rows;
  return [...rows].sort((a, b) => b.best.centsPerPoint - a.best.centsPerPoint);
}
