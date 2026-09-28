import { describe, expect, test } from "bun:test";
import { AIRPORTS } from "@/data/airports";
import {
  awardDistanceMultiplier,
  DISTANCE_REFERENCE_KM,
  distanceKm,
  isRedeemableRoute,
  MIN_ROUTE_KM,
} from "@/lib/distance";

describe("distanceKm", () => {
  test("matches published great-circle distances within 2%", () => {
    // Reference figures from published airport-pair tables.
    const known: [string, string, number][] = [
      ["JFK", "LHR", 5541],
      ["JFK", "LAX", 3974],
      ["LHR", "SIN", 10860],
      ["JFK", "HND", 10849],
      ["SYD", "LAX", 12051],
      ["AMS", "FRA", 365],
    ];
    for (const [from, to, expected] of known) {
      const got = distanceKm(from, to);
      expect(Math.abs(got - expected) / expected).toBeLessThan(0.02);
    }
  });

  test("is symmetric", () => {
    expect(distanceKm("JFK", "SYD")).toBe(distanceKm("SYD", "JFK"));
  });

  test("returns 0 for an airport we do not know", () => {
    expect(distanceKm("JFK", "ZZZ")).toBe(0);
    expect(distanceKm("ZZZ", "JFK")).toBe(0);
  });

  test("every airport carries usable coordinates", () => {
    for (const a of AIRPORTS) {
      expect(Number.isFinite(a.lat)).toBe(true);
      expect(Number.isFinite(a.lon)).toBe(true);
      expect(Math.abs(a.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(a.lon)).toBeLessThanOrEqual(180);
    }
  });
});

describe("awardDistanceMultiplier", () => {
  test("sits at 1.1 at the reference distance", () => {
    expect(awardDistanceMultiplier(DISTANCE_REFERENCE_KM)).toBeCloseTo(1.1, 2);
  });

  test("rises with distance", () => {
    const steps = [500, 2000, 5000, 9000, 14000, 18000].map(awardDistanceMultiplier);
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThan(steps[i - 1]);
  });

  test("is sublinear: triple the distance costs well under triple the miles", () => {
    const short = awardDistanceMultiplier(4000);
    const long = awardDistanceMultiplier(12000);
    expect(long / short).toBeLessThan(2);
  });

  test("stays inside its clamp", () => {
    for (const km of [0, 1, 50000]) {
      const m = awardDistanceMultiplier(km);
      expect(m).toBeGreaterThanOrEqual(0.32);
      expect(m).toBeLessThanOrEqual(1.9);
    }
  });
});

describe("isRedeemableRoute", () => {
  test("rejects same-metro pairs", () => {
    expect(isRedeemableRoute("JFK", "EWR")).toBe(false);
    expect(isRedeemableRoute("HND", "NRT")).toBe(false);
  });

  test("accepts anything past the minimum", () => {
    expect(isRedeemableRoute("AMS", "LHR")).toBe(true);
    expect(isRedeemableRoute("JFK", "LHR")).toBe(true);
    expect(distanceKm("AMS", "LHR")).toBeGreaterThan(MIN_ROUTE_KM);
  });
});
