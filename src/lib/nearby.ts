import { AIRPORTS, findAirport, type Airport } from "@/data/airports";
import { distanceKm } from "@/lib/distance";

/**
 * How close another airport has to be to count as the same trip.
 *
 * Deliberately tighter than MIN_ROUTE_KM, which only says two airports are
 * too close to fly between. At 250km that rule also pairs Vienna with
 * Budapest, Zurich with Milan and Seattle with Vancouver, which are
 * different cities in different countries rather than a second way out of
 * the same one. 120km keeps the thirteen real metros — the three New York
 * fields, Heathrow and Gatwick, O'Hare and Midway, Dulles and National and
 * BWI, Haneda and Narita, Incheon and Gimpo, and the rest — and nothing
 * that would send someone to another country by mistake.
 */
export const NEARBY_KM = 120;

/** The other airports serving the same metro, nearest first. */
export function nearbyAirports(code: string): Airport[] {
  if (!findAirport(code)) return [];
  return AIRPORTS.filter((a) => a.code !== code && distanceKm(code, a.code) <= NEARBY_KM).sort(
    (a, b) => distanceKm(code, a.code) - distanceKm(code, b.code),
  );
}

export type NearbyRoute = {
  origin: string;
  destination: string;
  /** Which end was swapped, so the page can say why this is being offered. */
  swapped: "origin" | "destination";
  km: number;
};

/**
 * The routes worth a second look, one end swapped at a time.
 *
 * Swapping both ends at once would square the list for no gain: nobody
 * driving to Newark is also landing at Gatwick because of it, and a search
 * page that offers nine alternatives to one route offers none of them
 * clearly. Origin swaps come first, because the airport you leave from is
 * the one you can actually choose.
 */
export function nearbyRoutes(origin: string, destination: string): NearbyRoute[] {
  const out: NearbyRoute[] = [];
  for (const a of nearbyAirports(origin)) {
    out.push({ origin: a.code, destination, swapped: "origin", km: distanceKm(origin, a.code) });
  }
  for (const a of nearbyAirports(destination)) {
    out.push({ origin, destination: a.code, swapped: "destination", km: distanceKm(destination, a.code) });
  }
  return out;
}
