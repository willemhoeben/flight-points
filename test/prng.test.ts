import { describe, expect, test } from "bun:test";
import { mulberry32, rngFor, seedFromString } from "@/lib/prng";

describe("seedFromString", () => {
  test("is deterministic for the same input", () => {
    expect(seedFromString("JFK|LHR|2026-01-01")).toBe(seedFromString("JFK|LHR|2026-01-01"));
  });

  test("differs for different inputs", () => {
    expect(seedFromString("JFK|LHR")).not.toBe(seedFromString("LHR|JFK"));
  });

  test("returns an unsigned 32-bit integer", () => {
    const seed = seedFromString("some fairly long input string to hash");
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(seed)).toBe(true);
  });

  test("handles the empty string", () => {
    expect(() => seedFromString("")).not.toThrow();
  });
});

describe("mulberry32", () => {
  test("is deterministic for the same seed", () => {
    const seqA = Array.from({ length: 5 }, mulberry32(42));
    const seqB = Array.from({ length: 5 }, mulberry32(42));
    expect(seqA).toEqual(seqB);
  });

  test("produces different sequences for different seeds", () => {
    const seqA = Array.from({ length: 5 }, mulberry32(1));
    const seqB = Array.from({ length: 5 }, mulberry32(2));
    expect(seqA).not.toEqual(seqB);
  });

  test("stays within [0, 1)", () => {
    const rand = mulberry32(123456);
    for (let i = 0; i < 200; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("rngFor", () => {
  test("is deterministic across calls with the same parts", () => {
    const a = rngFor("JFK", "LHR", "business", 2026)();
    const b = rngFor("JFK", "LHR", "business", 2026)();
    expect(a).toBe(b);
  });

  test("differs when any part changes", () => {
    const a = rngFor("JFK", "LHR", "business")();
    const b = rngFor("JFK", "LHR", "economy")();
    expect(a).not.toBe(b);
  });
});
