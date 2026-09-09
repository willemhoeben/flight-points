import { PROGRAMS } from "./programs";
import { rngFor } from "@/lib/prng";

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
  bookingWindow: string;
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
  const candidatePrograms = programIds && programIds.length > 0
    ? PROGRAMS.filter((p) => programIds.includes(p.id))
    : PROGRAMS;

  const results: AwardResult[] = [];

  for (const program of candidatePrograms) {
    const rng = rngFor(origin, destination, date, cabin, program.id);
    // Not every program has award space on every route/date/cabin.
    const hasSpace = rng() > 0.35;
    if (!hasSpace) continue;

    const base = CABIN_BASE_MILES[cabin];
    const variance = 0.75 + rng() * 0.9; // 0.75x - 1.65x of the base
    const milesCost = Math.round((base * variance) / 500) * 500;
    const taxesFeesUsd = Math.round(15 + rng() * (cabin === "economy" ? 45 : 220));
    const seatsRemaining = 1 + Math.floor(rng() * 4);
    const direct = rng() > 0.45;
    const connections = direct ? 0 : 1 + Math.floor(rng() * 2);
    const baseDuration = 300 + Math.floor(rng() * 600);
    const durationMinutes = baseDuration + connections * 90;
    const bookingWindow = rng() > 0.5 ? "Bookable online" : "Call to book";

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
