import { describe, expect, test } from "bun:test";
import { pointsToUsd, usdToPoints } from "@/lib/points-calc";

describe("pointsToUsd", () => {
  test("computes cents-per-point value in dollars", () => {
    expect(pointsToUsd(60000, 2.05)).toBeCloseTo(1230, 6);
  });

  test("zero points is zero value", () => {
    expect(pointsToUsd(0, 2.05)).toBe(0);
  });
});

describe("usdToPoints", () => {
  test("computes points needed for a target dollar amount", () => {
    expect(usdToPoints(1230, 2.05)).toBeCloseTo(60000, 6);
  });

  test("zero target is zero points", () => {
    expect(usdToPoints(0, 2.05)).toBe(0);
  });

  test("non-positive centsPerPoint never divides by zero or goes negative", () => {
    expect(usdToPoints(100, 0)).toBe(0);
  });
});

describe("pointsToUsd and usdToPoints round-trip", () => {
  test("usdToPoints(pointsToUsd(x)) recovers x for every valuation-like rate", () => {
    for (const centsPerPoint of [0.5, 1.2, 2.05, 3.0]) {
      for (const points of [0, 1000, 60000, 250000]) {
        const usd = pointsToUsd(points, centsPerPoint);
        expect(usdToPoints(usd, centsPerPoint)).toBeCloseTo(points, 6);
      }
    }
  });
});
