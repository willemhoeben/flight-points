import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "@/data/airports";
import { PROGRAMS } from "@/data/programs";
import { NETWORKS, REGION_ORDER, allHubs, hubsFor, regionOf } from "@/data/networks";
import { bearingDeg, distanceKm } from "@/lib/distance";
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
