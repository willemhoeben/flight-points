import { describe, expect, test } from "bun:test";
import {
  allianceFromSlug,
  allianceToSlug,
  buildResultsSortUrl,
  isNonstopOnlyParam,
  isResultsSortKey,
} from "@/lib/results-sort-url";

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

describe("allianceToSlug / allianceFromSlug", () => {
  test("round-trips every alliance through its slug", () => {
    const alliances = ["Star Alliance", "Oneworld", "SkyTeam", "Unaligned"] as const;
    for (const alliance of alliances) {
      expect(allianceFromSlug(allianceToSlug(alliance))).toBe(alliance);
    }
  });

  test("produces a URL-safe slug for the space-containing alliance name", () => {
    expect(allianceToSlug("Star Alliance")).toBe("star-alliance");
  });

  test("returns null for missing or unknown slugs", () => {
    expect(allianceFromSlug(null)).toBeNull();
    expect(allianceFromSlug("")).toBeNull();
    expect(allianceFromSlug("not-a-real-alliance")).toBeNull();
  });
});

describe("buildResultsSortUrl", () => {
  test("omits sort/dir/nonstop/alliance at the default state", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&destination=LHR", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: false,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK&destination=LHR");
  });

  test("resolves to a bare pathname when there are no other params either", () => {
    const url = buildResultsSortUrl("/search", "", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: false,
      alliance: null,
    });
    expect(url).toBe("/search");
  });

  test("adds sort and dir while preserving existing params", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&destination=LHR", {
      sortKey: "durationMinutes",
      sortDir: "asc",
      nonstopOnly: false,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK&destination=LHR&sort=durationMinutes&dir=asc");
  });

  test("updates dir in place when re-sorting the same non-default key", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&sort=durationMinutes&dir=asc", {
      sortKey: "durationMinutes",
      sortDir: "desc",
      nonstopOnly: false,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK&sort=durationMinutes&dir=desc");
  });

  test("strips sort and dir when returning to the default state", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&sort=seatsRemaining&dir=desc", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: false,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK");
  });

  test("adds nonstop=1 when the filter is on", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&destination=LHR", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: true,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK&destination=LHR&nonstop=1");
  });

  test("combines nonstop with a non-default sort", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK", {
      sortKey: "durationMinutes",
      sortDir: "asc",
      nonstopOnly: true,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK&sort=durationMinutes&dir=asc&nonstop=1");
  });

  test("removes nonstop when turned back off, preserving sort", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&sort=durationMinutes&dir=asc&nonstop=1", {
      sortKey: "durationMinutes",
      sortDir: "asc",
      nonstopOnly: false,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK&sort=durationMinutes&dir=asc");
  });

  test("adds an alliance slug when a filter is chosen", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: false,
      alliance: "Star Alliance",
    });
    expect(url).toBe("/search?origin=JFK&alliance=star-alliance");
  });

  test("combines alliance with nonstop and a non-default sort", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK", {
      sortKey: "durationMinutes",
      sortDir: "asc",
      nonstopOnly: true,
      alliance: "Oneworld",
    });
    expect(url).toBe("/search?origin=JFK&sort=durationMinutes&dir=asc&nonstop=1&alliance=oneworld");
  });

  test("removes alliance when cleared back to 'all', preserving other params", () => {
    const url = buildResultsSortUrl("/search", "origin=JFK&alliance=skyteam&nonstop=1", {
      sortKey: "milesCost",
      sortDir: "asc",
      nonstopOnly: true,
      alliance: null,
    });
    expect(url).toBe("/search?origin=JFK&nonstop=1");
  });
});
