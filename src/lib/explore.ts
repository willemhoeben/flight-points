import { AIRPORTS, type Airport } from "@/data/airports";
import { searchAvailability, type AwardResult, type Cabin } from "@/data/availability";
import { CHART_REGIONS, chartRegionOf, type ChartRegion } from "@/data/chart-regions";
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

export type RegionSummary = {
  region: ChartRegion;
  /** How many destinations in this region the current search found. */
  count: number;
  /** The cheapest award in the region, in miles. */
  fromMiles: number;
  /** The best cents-per-point in the region. */
  bestCentsPerPoint: number;
};

/**
 * "Where can I go with my points" is a question about regions.
 *
 * The honest answer to it is not 104 cities sorted by price. Scrolling that
 * list tells you Boston is cheap and, nineteen thousand pixels later, that
 * Auckland is not; it never tells you that Europe opens at 55,000 and Asia
 * does not start until 85,000, which is the shape of the answer and the
 * thing that decides a trip. Award charts are printed by region for exactly
 * this reason.
 *
 * Empty regions are left out rather than shown as zero. A region with
 * nothing in it is not an answer, and nine rows where two say "0" reads as
 * a broken table rather than as a finding.
 */
export function summariseByRegion(rows: ExploreDestination[]): RegionSummary[] {
  const summaries: RegionSummary[] = [];
  for (const region of CHART_REGIONS) {
    const inRegion = rows.filter((r) => chartRegionOf(r.airport) === region);
    if (inRegion.length === 0) continue;
    summaries.push({
      region,
      count: inRegion.length,
      fromMiles: Math.min(...inRegion.map((r) => r.best.milesCost)),
      bestCentsPerPoint: Math.max(...inRegion.map((r) => r.best.centsPerPoint)),
    });
  }
  return summaries;
}

export function filterByRegion(rows: ExploreDestination[], region: ChartRegion | null): ExploreDestination[] {
  if (!region) return rows;
  return rows.filter((r) => chartRegionOf(r.airport) === region);
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
