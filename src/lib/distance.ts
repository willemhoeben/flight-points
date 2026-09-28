import { findAirport } from "@/data/airports";

/**
 * Great-circle distance between two airports, in kilometres.
 *
 * Award charts are distance-banded and cash fares scale with distance, so
 * nothing downstream can price a seat honestly without this. Before it
 * existed a business seat to Newark cost the same as a business seat to
 * Tokyo — invisible while you looked at one route, obvious the moment a
 * list of destinations sat side by side.
 */
export function distanceKm(originCode: string, destinationCode: string): number {
  const a = findAirport(originCode);
  const b = findAirport(destinationCode);
  if (!a || !b) return 0;

  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const lat1 = a.lat * rad;
  const lat2 = b.lat * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
}

/**
 * The reference distance the curve is scaled around: a standard long-haul.
 * The multiplier here is 1.1, not 1.0 — the cabin base fares are set a
 * little under a long-haul award so the short end lands in the right place.
 */
export const DISTANCE_REFERENCE_KM = 9000;

/**
 * Sublinear, the way a published award chart is: a flight three times as
 * long costs well under three times the miles. Calibrated against the real
 * Aeroplan and KrisFlyer charts, which it lands within a few thousand miles
 * of on both the Atlantic and the Pacific: business New York-London around
 * 48,000 and New York-Tokyo around 69,000.
 */
export function awardDistanceMultiplier(km: number): number {
  if (km <= 0) return 1;
  const m = 0.35 + 0.75 * Math.pow(km / DISTANCE_REFERENCE_KM, 0.8);
  return Math.max(0.32, Math.min(1.9, m));
}

/** Two airports in the same metro area are not a route anyone redeems for. */
export const MIN_ROUTE_KM = 250;

export function isRedeemableRoute(originCode: string, destinationCode: string): boolean {
  const km = distanceKm(originCode, destinationCode);
  return km >= MIN_ROUTE_KM;
}
