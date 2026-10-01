import { describe, expect, test } from "bun:test";
import { AIRPORTS, findAirport } from "@/data/airports";
import { PROGRAMS } from "@/data/programs";
import { NETWORKS, REGION_ORDER, allHubs, hubsFor, programServesRoute, regionOf } from "@/data/networks";
import { bearingDeg, distanceKm, MIN_ROUTE_KM } from "@/lib/distance";
import { byRegion, networkFrom, ringsFor } from "@/lib/network";

describe("network data", () => {
  test("every program has a network", () => {
    for (const p of PROGRAMS) expect(NETWORKS[p.id], `no network for ${p.id}`).toBeDefined();
  });

  test("every hub is an airport we know", () => {
    const codes = new Set(AIRPORTS.map((a) => a.code));
    for (const [id, net] of Object.entries(NETWORKS)) {
      expect(net.hubs.length, `${id} has no hub`).toBeGreaterThan(0);
      for (const h of net.hubs) expect(codes.has(h), `${id} hub ${h} is not an airport`).toBe(true);
    }
  });

  test("every region named is one the chart can group", () => {
    for (const [id, net] of Object.entries(NETWORKS)) {
      expect(net.regions.length, `${id} serves nowhere`).toBeGreaterThan(0);
      for (const r of net.regions) expect(REGION_ORDER.includes(r), `${id}: ${r}`).toBe(true);
    }
  });

  test("every airport falls in a region", () => {
    for (const a of AIRPORTS) expect(REGION_ORDER.includes(regionOf(a))).toBe(true);
  });

  test("ranges are plausible sectors, not placeholders", () => {
    for (const [id, net] of Object.entries(NETWORKS)) {
      expect(net.maxKm, `${id}`).toBeGreaterThanOrEqual(4000);
      expect(net.maxKm, `${id}`).toBeLessThanOrEqual(16000);
    }
  });

  test("hubsFor and allHubs read the same data", () => {
    expect(hubsFor("finnair")).toEqual(["HEL"]);
    expect(hubsFor("not-a-program")).toEqual([]);
    expect(allHubs()).toContain("HEL");
    expect(allHubs()).toContain("PTY");
    expect(new Set(allHubs()).size).toBe(allHubs().length);
  });
});

describe("networkFrom", () => {
  test("is sorted outward from the hub", () => {
    const legs = networkFrom("united", "EWR");
    for (let i = 1; i < legs.length; i++) expect(legs[i].km).toBeGreaterThanOrEqual(legs[i - 1].km);
  });

  test("never includes the hub or its own metro area", () => {
    const codes = networkFrom("united", "EWR").map((l) => l.airport.code);
    expect(codes).not.toContain("EWR");
    expect(codes).not.toContain("JFK"); // 35 km away
  });

  test("respects the regions the airline serves", () => {
    for (const leg of networkFrom("southwest", "DFW")) expect(leg.region).toBe("North America");
    for (const leg of networkFrom("copa", "PTY")) {
      expect(["Latin America", "North America"]).toContain(leg.region);
    }
  });

  test("respects the range of the longest sector", () => {
    for (const leg of networkFrom("alaska", "SEA")) expect(leg.km).toBeLessThanOrEqual(5000);
    for (const leg of networkFrom("emirates", "DXB")) expect(leg.km).toBeLessThanOrEqual(14500);
  });

  test("a regional carrier and a global one look nothing alike", () => {
    expect(networkFrom("southwest", "DFW").length).toBeLessThan(25);
    expect(networkFrom("emirates", "DXB").length).toBeGreaterThan(60);
  });

  test("returns nothing for a hub the program does not have", () => {
    expect(networkFrom("finnair", "JFK")).toEqual([]);
    expect(networkFrom("not-a-program", "HEL")).toEqual([]);
  });

  test("carries the bearing the chart plots against", () => {
    const legs = networkFrom("britishairways", "LHR");
    const jfk = legs.find((l) => l.airport.code === "JFK")!;
    // London to New York runs a little north of due west.
    expect(jfk.bearing).toBeGreaterThan(255);
    expect(jfk.bearing).toBeLessThan(300);
    expect(jfk.km).toBe(distanceKm("LHR", "JFK"));
    expect(jfk.bearing).toBe(bearingDeg("LHR", "JFK"));
  });
});

describe("ringsFor", () => {
  test("gives three to five round rings", () => {
    for (const max of [3200, 4400, 9800, 12400, 15400]) {
      const rings = ringsFor(max);
      expect(rings.length).toBeGreaterThanOrEqual(3);
      expect(rings.length).toBeLessThanOrEqual(5);
      expect(rings[rings.length - 1]).toBeGreaterThanOrEqual(max);
    }
  });

  test("scales to short-haul instead of leaving the chart empty", () => {
    // The smallest step that fits in three to five rings wins, so a short
    // network gets finer rings rather than a couple of coarse ones.
    expect(ringsFor(4400)).toEqual([1000, 2000, 3000, 4000, 5000]);
    expect(ringsFor(14400)).toEqual([5000, 10000, 15000]);
  });

  test("rings climb evenly", () => {
    const rings = ringsFor(9800);
    const step = rings[0];
    rings.forEach((r, i) => expect(r).toBe(step * (i + 1)));
  });

  test("handles an empty network", () => {
    expect(ringsFor(0)).toEqual([2000, 4000]);
  });
});

describe("byRegion", () => {
  test("keeps every leg and groups them", () => {
    const legs = networkFrom("lufthansa", "FRA");
    const groups = byRegion(legs);
    expect(groups.reduce((n, g) => n + g.legs.length, 0)).toBe(legs.length);
    expect(new Set(groups.map((g) => g.region)).size).toBe(groups.length);
  });

  test("lists regions in REGION_ORDER, not nearest-first", () => {
    for (const [id, net] of Object.entries(NETWORKS)) {
      const groups = byRegion(networkFrom(id, net.hubs[0]));
      const positions = groups.map((g) => REGION_ORDER.indexOf(g.region));
      const sorted = [...positions].sort((a, b) => a - b);
      expect(positions, `${id} regions out of order`).toEqual(sorted);
    }
  });

  test("keeps each region's legs sorted outward", () => {
    for (const { legs } of byRegion(networkFrom("united", "SFO"))) {
      for (let i = 1; i < legs.length; i++) expect(legs[i].km).toBeGreaterThanOrEqual(legs[i - 1].km);
    }
  });
});

describe("programServesRoute", () => {
  test("an unaligned program only sells where its own metal flies", () => {
    // Southwest is North America only, and has no alliance to borrow from.
    expect(programServesRoute("southwest", "JFK", "LAX")).toBe(true);
    expect(programServesRoute("southwest", "JFK", "LHR")).toBe(false);
    expect(programServesRoute("southwest", "ADD", "LHR")).toBe(false);
    // Icelandair reaches Europe and North America, nothing else.
    expect(programServesRoute("icelandair", "KEF", "JFK")).toBe(true);
    expect(programServesRoute("icelandair", "SYD", "AKL")).toBe(false);
    expect(programServesRoute("icelandair", "HNL", "NRT")).toBe(false);
  });

  /**
   * The whole reason to hold an alliance currency: you spend it on anyone
   * in the alliance. Aegean flies no further than the Middle East, and
   * Aegean miles still book a Star Alliance seat across the Pacific.
   */
  test("an alliance program sells anywhere its alliance reaches", () => {
    expect(programServesRoute("aegean", "ATH", "FCO")).toBe(true);
    expect(programServesRoute("aegean", "JFK", "SYD")).toBe(true);
    expect(programServesRoute("thai", "JFK", "LHR")).toBe(true);
    expect(programServesRoute("royalairmaroc", "SYD", "AKL")).toBe(true);
  });

  test("is symmetric, and true of a program's own hubs", () => {
    for (const p of PROGRAMS) {
      const hubs = NETWORKS[p.id]?.hubs ?? [];
      for (const hub of hubs) {
        for (const other of hubs) {
          if (hub === other) continue;
          expect(programServesRoute(p.id, hub, other), `${p.id} ${hub}-${other}`).toBe(true);
        }
      }
      for (const [o, d] of [["JFK", "LHR"], ["SYD", "AKL"], ["ADD", "NBO"], ["HNL", "NRT"]]) {
        expect(programServesRoute(p.id, o, d)).toBe(programServesRoute(p.id, d, o));
      }
    }
  });

  test("an unknown program or airport sells nothing", () => {
    expect(programServesRoute("nope", "JFK", "LHR")).toBe(false);
    expect(programServesRoute("united", "ZZZ", "LHR")).toBe(false);
    expect(programServesRoute("united", "JFK", "")).toBe(false);
  });

  /**
   * The gate has to narrow the list without emptying it: a route nobody
   * can price is a page with nothing on it, which is worse than a page
   * with one implausible airline.
   */
  test("every pair of hubs in the data still has programs that can price it", () => {
    const hubs = allHubs();
    for (const o of hubs) {
      for (const d of hubs) {
        if (o === d || distanceKm(o, d) < MIN_ROUTE_KM) continue;
        const n = PROGRAMS.filter((p) => programServesRoute(p.id, o, d)).length;
        expect(n, `${o}-${d}`).toBeGreaterThan(5);
      }
    }
  });
});

describe("the alliance-reach cache", () => {
  /**
   * A union of each member's regions would be wrong: it would say an
   * alliance serves Europe to Asia when one member flies only Europe and
   * another only Asia, and neither can actually sell the route. This pins
   * the cached answer against the naive rescan for every program and every
   * pair of airports in the data.
   */
  function naiveFlys(id: string, origin: string, destination: string): boolean {
    const net = NETWORKS[id];
    const a = findAirport(origin);
    const b = findAirport(destination);
    if (!net || !a || !b) return false;
    return net.regions.includes(regionOf(a)) && net.regions.includes(regionOf(b));
  }

  function naive(id: string, origin: string, destination: string): boolean {
    if (naiveFlys(id, origin, destination)) return true;
    const alliance = PROGRAMS.find((p) => p.id === id)?.alliance;
    if (!alliance || alliance === "Unaligned") return false;
    return PROGRAMS.some((p) => p.alliance === alliance && naiveFlys(p.id, origin, destination));
  }

  test("answers exactly what rescanning every program would", () => {
    // One airport in each region is enough: the answer depends on the pair
    // of regions, not on which airport inside one you picked.
    const sample = REGION_ORDER.map((r) => AIRPORTS.find((a) => regionOf(a) === r)).filter(
      (a): a is NonNullable<typeof a> => !!a,
    );
    expect(sample.length).toBe(REGION_ORDER.length);
    for (const p of PROGRAMS) {
      for (const a of sample) {
        for (const b of sample) {
          expect(programServesRoute(p.id, a.code, b.code), `${p.id} ${a.code}-${b.code}`).toBe(
            naive(p.id, a.code, b.code),
          );
        }
      }
    }
  });

  test("two airports in the same region always answer alike", () => {
    const byRegionPair = new Map<string, boolean>();
    for (const p of PROGRAMS.slice(0, 6)) {
      for (const a of AIRPORTS) {
        for (const b of AIRPORTS.slice(0, 24)) {
          const key = `${p.id}|${regionOf(a)}|${regionOf(b)}`;
          const answer = programServesRoute(p.id, a.code, b.code);
          const seen = byRegionPair.get(key);
          if (seen === undefined) byRegionPair.set(key, answer);
          else expect(answer, `${key} via ${a.code}-${b.code}`).toBe(seen);
        }
      }
    }
  });
});
