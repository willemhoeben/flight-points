import { describe, expect, test } from "bun:test";
import { buildResultsSortUrl, isNonstopOnlyParam, isResultsSortKey } from "@/lib/results-sort-url";

describe("isResultsSortKey", () => {
  test("accepts every results sort key", () => {
    expect(isResultsSortKey("milesCost")).toBe(true);
    expect(isResultsSortKey("durationMinutes")).toBe(true);
    expect(isResultsSortKey("seatsRemaining")).toBe(true);
  });

  test("rejects unknown values", () => {
    expect(isResultsSortKey("price")).toBe(false);
    expect(isResultsSortKey(null)).toBe(false);
    expect(isResultsSortKey("")).toBe(false);
  });
});

describe("isNonstopOnlyParam", () => {
  test("accepts exactly '1'", () => {
    expect(isNonstopOnlyParam("1")).toBe(true);
  });

  test("rejects anything else", () => {
    expect(isNonstopOnlyParam("true")).toBe(false);
    expect(isNonstopOnlyParam("0")).toBe(false);
    expect(isNonstopOnlyParam(null)).toBe(false);
    expect(isNonstopOnlyParam("")).toBe(false);
  });
});

describe("buildResultsSortUrl", () => {
  test("omits sort/dir/nonstop at the default state", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&destination=LHR", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: false,
    });
    expect(url).toBe("/search?origin=JFK&destination=LHR");
  });

  test("resolves to a bare pathname when there are no other params either", () => {
    const url = buildResultsSortUrl("/search", "", { sortKey: "milesCost", sortDir: "asc", nonstopOnly: false });
    expect(url).toBe("/search");
  });

  test("adds sort and dir while preserving existing params", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&destination=LHR", {
      sortKey: "durationMinutes",
      sortDir: "asc",
      nonstopOnly: false,
    });
    expect(url).toBe("/search?origin=JFK&destination=LHR&sort=durationMinutes&dir=asc");
  });

  test("updates dir in place when re-sorting the same non-default key", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&sort=durationMinutes&dir=asc", {
      sortKey: "durationMinutes",
      sortDir: "desc",
      nonstopOnly: false,
    });
    expect(url).toBe("/search?origin=JFK&sort=durationMinutes&dir=desc");
  });

  test("strips sort and dir when returning to the default state", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&sort=seatsRemaining&dir=desc", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: false,
    });
    expect(url).toBe("/search?origin=JFK");
  });

  test("adds nonstop=1 when the filter is on", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&destination=LHR", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: true,
    });
    expect(url).toBe("/search?origin=JFK&destination=LHR&nonstop=1");
  });

  test("combines nonstop with a non-default sort", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK", {
      sortKey: "durationMinutes",
      sortDir: "asc",
      nonstopOnly: true,
    });
    expect(url).toBe("/search?origin=JFK&sort=durationMinutes&dir=asc&nonstop=1");
  });

  test("removes nonstop when turned back off, preserving sort", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&sort=durationMinutes&dir=asc&nonstop=1", {
      sortKey: "durationMinutes",
      sortDir: "asc",
      nonstopOnly: false,
    });
    expect(url).toBe("/search?origin=JFK&sort=durationMinutes&dir=asc");
  });
});
