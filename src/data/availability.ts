import { PROGRAMS } from "./programs";
import { rngFor } from "@/lib/prng";
import { awardDistanceMultiplier, distanceKm, MIN_ROUTE_KM } from "@/lib/distance";

export type Cabin = "economy" | "premium" | "business" | "first";

export const CABINS: { id: Cabin; label: string }[] = [
  { id: "economy", label: "Economy" },
  { id: "premium", label: "Premium Economy" },
  { id: "business", label: "Business" },
  { id: "first", label: "First" },
];

const CABIN_BASE_MILES: Record<Cabin, number> = {
  economy: 15000,
  premium: 30000,
  business: 65000,
  first: 110000,
};

/**
 * One-way cash fare multipliers. Premium one-ways are punished far harder
 * than round-trips, which is exactly why a business award beats a business
 * ticket and an economy award rarely does.
 */
const CABIN_CASH_MULTIPLIER: Record<Cabin, number> = {
  economy: 1,
  premium: 2.2,
  business: 6,
  first: 11,
};

/**
 * What the same seat would cost in cash. Seeded on the route and date but
 * NOT on the program: the price of a seat is a property of the flight, the
 * same for every program looking at it.
 *
 * Calibrated against published one-way revenue fares: ~$340 economy /
 * ~$2,000 business New York-London, ~$630 / ~$3,800 New York-Tokyo.
 */
export function cashFareUsd(params: {
  origin: string;
  destination: string;
  date: string;
  cabin: Cabin;
}): number {
  const { origin, destination, date, cabin } = params;
  const km = distanceKm(origin, destination);
  if (km <= 0) return 0;
  const rng = rngFor(origin, destination, date, cabin, "cash");
  const base = 35 + 0.055 * km;
  const seasonal = 0.85 + rng() * 0.4;
  return Math.round(base * CABIN_CASH_MULTIPLIER[cabin] * seasonal);
}

export type BookingWindow = "online" | "call";

export type AwardResult = {
  id: string;
  programId: string;
  programName: string;
  cabin: Cabin;
  milesCost: number;
  taxesFeesUsd: number;
  seatsRemaining: number;
  direct: boolean;
  durationMinutes: number;
  connections: number;
  bookingWindow: BookingWindow;
  /** Estimated one-way cash fare for the same seat. */
  cashFareUsd: number;
  /** (cash fare - taxes) / miles, in cents: what each point actually buys. */
  centsPerPoint: number;
};

/**
 * Deterministic mock award-availability search. Not connected to any live
 * inventory feed — same inputs always return the same rows so the UI is
 * stable to click through and screenshot.
 */
export function searchAvailability(params: {
  origin: string;
  destination: string;
  date: string;
  cabin: Cabin;
  programIds?: string[];
}): AwardResult[] {
  const { origin, destination, date, cabin, programIds } = params;
  const km = distanceKm(origin, destination);
  // Same-metro pairs get no award space at all rather than an invented price.
  if (km > 0 && km < MIN_ROUTE_KM) return [];

  const fare = cashFareUsd({ origin, destination, date, cabin });
  const candidatePrograms = programIds && programIds.length > 0
    ? PROGRAMS.filter((p) => programIds.includes(p.id))
    : PROGRAMS;

  const results: AwardResult[] = [];

  for (const program of candidatePrograms) {
    const rng = rngFor(origin, destination, date, cabin, program.id);
    // Not every program has award space on every route/date/cabin.
    const hasSpace = rng() > 0.35;
    if (!hasSpace) continue;

    const base = CABIN_BASE_MILES[cabin] * awardDistanceMultiplier(km);
    const variance = 0.85 + rng() * 0.45;
    const milesCost = Math.round((base * variance) / 500) * 500;
    const taxesFeesUsd = Math.round(15 + rng() * (cabin === "economy" ? 45 : 220));
    const seatsRemaining = 1 + Math.floor(rng() * 4);
    // A nonstop gets less likely the further you go, so the routing column
    // stops claiming a nonstop New York to Sydney on a random Tuesday.
    const directOdds = km > 12000 ? 0.78 : km > 7000 ? 0.56 : 0.36;
    const direct = rng() > directOdds;
    // Short hops do not get double-connected; two stops inside six hours was
    // the giveaway that the routing column was not thinking about distance.
    const connections = direct ? 0 : km < 3000 ? 1 : 1 + Math.floor(rng() * 2);
    const durationMinutes =
      Math.round((km / 850) * 60 * (0.94 + rng() * 0.14)) + 35 + connections * 95;
    const bookingWindow: BookingWindow = rng() > 0.5 ? "online" : "call";
    const centsPerPoint =
      milesCost > 0
        ? Math.round((Math.max(0, fare - taxesFeesUsd) / milesCost) * 10000) / 100
        : 0;

    results.push({
      id: `${program.id}-${date}-${cabin}`,
      programId: program.id,
      programName: program.name,
      cabin,
      milesCost,
      taxesFeesUsd,
      seatsRemaining,
      direct,
      durationMinutes,
      connections,
      bookingWindow,
      cashFareUsd: fare,
      centsPerPoint,
    });
  }

  return results.sort((a, b) => a.milesCost - b.milesCost);
}

export type CalendarDay = {
  date: string;
  lowestMiles: number | null;
  programId: string | null;
};

/** Lowest available miles cost per day across the range, for the trip calendar. */
export function searchCalendar(params: {
  origin: string;
  destination: string;
  cabin: Cabin;
  startDate: string;
  days: number;
  programIds?: string[];
}): CalendarDay[] {
  const { origin, destination, cabin, startDate, days, programIds } = params;
  const start = new Date(`${startDate}T00:00:00Z`);
  const out: CalendarDay[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const results = searchAvailability({ origin, destination, date: dateStr, cabin, programIds });
    const lowest = results[0] ?? null;
    out.push({
      date: dateStr,
      lowestMiles: lowest ? lowest.milesCost : null,
      programId: lowest ? lowest.programId : null,
    });
  }

  return out;
}
