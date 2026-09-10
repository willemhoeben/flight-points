import { describe, expect, test } from "bun:test";
import { isDealSort, sortDeals } from "@/lib/deal-sort";
import { DEALS } from "@/data/deals";
import type { Deal } from "@/data/deals";

function deal(overrides: Partial<Deal>): Deal {
  return {
    slug: "x",
    title: "x",
    summary: "x",
    category: "sale",
    program: "x",
    publishedAt: "2026-01-01",
    body: [],
    ...overrides,
  };
}

describe("isDealSort", () => {
  test("accepts known sort values", () => {
    expect(isDealSort("newest")).toBe(true);
    expect(isDealSort("expiring")).toBe(true);
  });

  test("rejects unknown or missing values", () => {
    expect(isDealSort("oldest")).toBe(false);
    expect(isDealSort(undefined)).toBe(false);
    expect(isDealSort("")).toBe(false);
  });
});

describe("sortDeals", () => {
  test("null sort returns the original order unchanged", () => {
    expect(sortDeals(DEALS, null)).toEqual(DEALS);
  });

  test("newest sorts by publishedAt descending", () => {
    const deals = [
      deal({ slug: "a", publishedAt: "2026-01-01" }),
      deal({ slug: "b", publishedAt: "2026-03-01" }),
      deal({ slug: "c", publishedAt: "2026-02-01" }),
    ];
    expect(sortDeals(deals, "newest").map((d) => d.slug)).toEqual(["b", "c", "a"]);
  });

  test("expiring sorts by expires ascending, non-expiring deals last", () => {
    const deals = [
      deal({ slug: "no-expiry", publishedAt: "2026-01-01" }),
      deal({ slug: "expires-later", expires: "2026-12-01", publishedAt: "2026-01-01" }),
      deal({ slug: "expires-soonest", expires: "2026-06-01", publishedAt: "2026-01-01" }),
    ];
    expect(sortDeals(deals, "expiring").map((d) => d.slug)).toEqual([
      "expires-soonest",
      "expires-later",
      "no-expiry",
    ]);
  });

  test("expiring never drops a deal", () => {
    expect(sortDeals(DEALS, "expiring")).toHaveLength(DEALS.length);
  });

  test("never mutates the input array", () => {
    const deals = [deal({ slug: "a", publishedAt: "2026-01-01" }), deal({ slug: "b", publishedAt: "2026-02-01" })];
    const copy = [...deals];
    sortDeals(deals, "newest");
    expect(deals).toEqual(copy);
  });
});
