import type { AwardResult } from "@/data/availability";

/** Which half of a round trip the results table is showing. */
export type Leg = "outbound" | "return";

export function parseLeg(value: string | null | undefined): Leg {
  return value === "return" ? "return" : "outbound";
}

/**
 * Why a return date the visitor asked for is not being used.
 *
 * Dropping it silently would leave them looking at a one-way page they did
 * not ask for with nothing to explain it, so the page says which of these
 * happened and what it did instead.
 */
export type ReturnIssue = "malformed" | "before-departure";

export type TripDates = {
  departure: string;
  /** null for a one-way trip. */
  returnDate: string | null;
  issue: ReturnIssue | null;
};

/**
 * Resolves the pair of dates a trip actually runs on.
 *
 * A return before the departure is the one mistake a date picker cannot
 * prevent once the URL is hand-edited or the departure moves forward under
 * a return that was already set, and there is no sensible repair for it —
 * guessing a year, or swapping the two, would book a trip nobody asked
 * for. So it falls back to one way and says so.
 */
export function resolveTripDates(departure: string, rawReturn: string | null | undefined, isValidDate: (v: string) => boolean): TripDates {
  if (rawReturn === null || rawReturn === undefined || rawReturn === "") {
    return { departure, returnDate: null, issue: null };
  }
  if (!isValidDate(rawReturn)) return { departure, returnDate: null, issue: "malformed" };
  if (rawReturn < departure) return { departure, returnDate: null, issue: "before-departure" };
  return { departure, returnDate: rawReturn, issue: null };
}

export type RoundTrip = {
  outbound: AwardResult;
  inbound: AwardResult;
  /** Miles for one traveller, both legs. */
  milesCost: number;
  taxesFeesUsd: number;
  /** True when one program covers the whole trip. */
  sameProgram: boolean;
};

/**
 * The cheapest way to fly both legs.
 *
 * Deliberately picks each leg independently rather than insisting on one
 * program for the pair: nothing stops you booking two one-way awards from
 * two programs, and points travellers do it constantly, so forcing a single
 * program would quote a price above the one that is actually bookable. The
 * summary says which case came out ahead, because a two-program trip means
 * two balances to have ready rather than one.
 */
export function cheapestRoundTrip(outbound: AwardResult[], inbound: AwardResult[]): RoundTrip | null {
  if (outbound.length === 0 || inbound.length === 0) return null;
  const out = outbound.reduce((a, b) => (b.milesCost < a.milesCost ? b : a));
  const back = inbound.reduce((a, b) => (b.milesCost < a.milesCost ? b : a));
  return {
    outbound: out,
    inbound: back,
    milesCost: out.milesCost + back.milesCost,
    taxesFeesUsd: Math.round((out.taxesFeesUsd + back.taxesFeesUsd) * 100) / 100,
    sameProgram: out.programId === back.programId,
  };
}

/**
 * Nights between the two dates. Zero is a legal same-day turn, which is a
 * real thing people do to keep a fare rule, so it is not an error.
 */
export function nightsAway(departure: string, returnDate: string): number {
  const a = Date.UTC(+departure.slice(0, 4), +departure.slice(5, 7) - 1, +departure.slice(8, 10));
  const b = Date.UTC(+returnDate.slice(0, 4), +returnDate.slice(5, 7) - 1, +returnDate.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}
