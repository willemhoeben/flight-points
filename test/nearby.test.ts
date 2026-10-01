import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "@/data/airports";
import { distanceKm } from "@/lib/distance";
import { NEARBY_KM, nearbyAirports, nearbyRoutes } from "@/lib/nearby";

describe("nearbyAirports", () => {
  test("finds the other gateways for a metro that has them", () => {
    expect(nearbyAirports("JFK").map((a) => a.code)).toEqual(["LGA", "EWR"]);
    expect(nearbyAirports("LHR").map((a) => a.code)).toEqual(["LGW"]);
    expect(nearbyAirports("CDG").map((a) => a.code)).toEqual(["ORY"]);
    expect(nearbyAirports("HND").map((a) => a.code)).toEqual(["NRT"]);
    expect(nearbyAirports("ICN").map((a) => a.code)).toEqual(["GMP"]);
  });

  test("is empty for a city with one airport", () => {
    for (const code of ["SIN", "DOH", "BKK", "SYD", "HNL"]) {
      expect(nearbyAirports(code), code).toEqual([]);
    }
  });

  test("never returns the airport itself, or an unknown code", () => {
    for (const a of AIRPORTS) {
      expect(nearbyAirports(a.code).map((x) => x.code)).not.toContain(a.code);
    }
    expect(nearbyAirports("ZZZ")).toEqual([]);
    expect(nearbyAirports("")).toEqual([]);
  });

  test("is nearest first", () => {
    for (const a of AIRPORTS) {
      const near = nearbyAirports(a.code);
      for (let i = 1; i < near.length; i++) {
        expect(distanceKm(a.code, near[i].code)).toBeGreaterThanOrEqual(
          distanceKm(a.code, near[i - 1].code),
        );
      }
    }
  });

  test("is symmetric: if A is near B then B is near A", () => {
    for (const a of AIRPORTS) {
      for (const b of nearbyAirports(a.code)) {
        expect(nearbyAirports(b.code).map((x) => x.code), `${b.code} should list ${a.code}`).toContain(a.code);
      }
    }
  });

  /**
   * The threshold is the whole design: too wide and the page offers a
   * different country as a way out of your own city.
   */
  test("keeps the real metros out and the far-apart pairs out", () => {
    const codes = (c: string) => nearbyAirports(c).map((a) => a.code);
    // 158km apart, and a different country.
    expect(codes("AMS")).not.toContain("BRU");
    // 204km, and across the Alps.
    expect(codes("ZRH")).not.toContain("MXP");
    // 205km, and across a border.
    expect(codes("SEA")).not.toContain("YVR");
    // 214km, and a different country again.
    expect(codes("VIE")).not.toContain("BUD");
    // Everything kept is inside the threshold.
    for (const a of AIRPORTS) {
      for (const b of nearbyAirports(a.code)) {
        expect(distanceKm(a.code, b.code)).toBeLessThanOrEqual(NEARBY_KM);
      }
    }
  });
});

describe("nearbyRoutes", () => {
  test("swaps one end at a time, origins first", () => {
    const routes = nearbyRoutes("JFK", "LHR");
    expect(routes.map((r) => `${r.origin}-${r.destination}`)).toEqual([
      "LGA-LHR",
      "EWR-LHR",
      "JFK-LGW",
    ]);
    expect(routes.filter((r) => r.swapped === "origin")).toHaveLength(2);
    expect(routes.filter((r) => r.swapped === "destination")).toHaveLength(1);
  });

  test("never swaps both ends at once", () => {
    for (const r of nearbyRoutes("JFK", "LHR")) {
      expect(r.origin === "JFK" || r.destination === "LHR").toBe(true);
    }
  });

  test("never offers the route that was already searched", () => {
    for (const [o, d] of [["JFK", "LHR"], ["ORD", "CDG"], ["IAD", "HND"], ["SFO", "ICN"]]) {
      for (const r of nearbyRoutes(o, d)) {
        expect(`${r.origin}-${r.destination}`).not.toBe(`${o}-${d}`);
      }
    }
  });

  test("is empty when neither end has a neighbour", () => {
    expect(nearbyRoutes("SIN", "SYD")).toEqual([]);
  });

  /**
   * Both ends of a metro-to-metro search have alternatives, and the list
   * still has to stay readable — this is why it swaps one end at a time.
   */
  test("stays short even when both ends are crowded", () => {
    const routes = nearbyRoutes("IAD", "JFK");
    expect(routes.length).toBe(4);
    expect(routes.length).toBeLessThan(
      nearbyAirports("IAD").length * nearbyAirports("JFK").length + 4,
    );
  });
});
