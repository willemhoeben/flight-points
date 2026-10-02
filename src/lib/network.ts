import { AIRPORTS, type Airport } from "@/data/airports";
import { NETWORKS, REGION_ORDER, regionOf, type Region } from "@/data/networks";
import { bearingDeg, distanceKm, MIN_ROUTE_KM } from "@/lib/distance";

export type NetworkLeg = {
  airport: Airport;
  km: number;
  /** Degrees clockwise from north, as an azimuthal plot needs. */
  bearing: number;
  region: Region;
};

/**
 * Every destination a program's own airline reaches from one of its hubs,
 * sorted by distance so the list reads outward the same way the rings do.
 */
export function networkFrom(programId: string, hubCode: string): NetworkLeg[] {
  const net = NETWORKS[programId];
  if (!net || !net.hubs.includes(hubCode)) return [];

  return AIRPORTS.filter((a) => {
    if (a.code === hubCode) return false;
    if (!net.regions.includes(regionOf(a))) return false;
    const km = distanceKm(hubCode, a.code);
    return km >= MIN_ROUTE_KM && km <= net.maxKm;
  })
    .map((airport) => ({
      airport,
      km: distanceKm(hubCode, airport.code),
      bearing: bearingDeg(hubCode, airport.code),
      region: regionOf(airport),
    }))
    .sort((a, b) => a.km - b.km);
}

const RING_STEPS = [500, 1000, 2000, 2500, 5000];

/**
 * Range rings scaled to the network being drawn rather than to the globe.
 * Fixed rings squeezed a short-haul carrier into a dot in the middle with
 * four fifths of the chart empty, so the step is picked to give three to
 * five round rings covering the longest route on screen.
 */
export function ringsFor(maxKm: number): number[] {
  if (maxKm <= 0) return [2000, 4000];
  const step =
    RING_STEPS.find((s) => {
      const n = Math.ceil(maxKm / s);
      return n >= 3 && n <= 5;
    }) ?? RING_STEPS[RING_STEPS.length - 1];
  const count = Math.ceil(maxKm / step);
  return Array.from({ length: count }, (_, i) => step * (i + 1));
}

/** Groups legs by region, in the order the regions should be listed. */
export function byRegion(legs: NetworkLeg[]): { region: Region; legs: NetworkLeg[] }[] {
  const groups = new Map<Region, NetworkLeg[]>();
  for (const leg of legs) {
    const list = groups.get(leg.region);
    if (list) list.push(leg);
    else groups.set(leg.region, [leg]);
  }
  // REGION_ORDER, not insertion order: the legs arrive sorted by distance, so
  // insertion order would put whichever region happens to hold the shortest
  // hop first and reshuffle the headings every time the hub changes.
  return REGION_ORDER.filter((r) => groups.has(r)).map((region) => ({
    region,
    legs: groups.get(region) as NetworkLeg[],
  }));
}

/**
 * The programme and hub whose plot fills the circle best, used for the
 * drawing on the landing page.
 *
 * Picked from the data rather than written down, so adding airports or a
 * programme re-picks it instead of leaving the front door showing a network
 * that used to be the widest one. Destination count decides it, with the
 * longest route breaking ties: both of those are what make the plot look
 * like something, since a carrier with few routes or a short reach draws a
 * sparse little star.
 *
 * Computed once per process, not per request. It reads the whole airport
 * list for every programme and hub, which is a few hundred thousand
 * distance calculations — nothing at boot, wasteful on every page view.
 */
export function widestNetwork(): { programId: string; hub: string; count: number } {
  let best = { programId: "", hub: "", count: -1, reach: -1 };
  for (const [programId, net] of Object.entries(NETWORKS)) {
    for (const hub of net.hubs) {
      const legs = networkFrom(programId, hub);
      const reach = legs.length ? legs[legs.length - 1].km : 0;
      if (legs.length > best.count || (legs.length === best.count && reach > best.reach)) {
        best = { programId, hub, count: legs.length, reach };
      }
    }
  }
  return { programId: best.programId, hub: best.hub, count: best.count };
}

export const WIDEST_NETWORK = widestNetwork();
