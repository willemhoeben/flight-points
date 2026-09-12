import { describe, expect, test } from "bun:test";
import {
  buildValuationsUrl,
  isSortDir,
  isValuationsSortKey,
  isValuationType,
} from "@/lib/valuations-url";

describe("isValuationType", () => {
  test("accepts every valuation type", () => {
    expect(isValuationType("bank")).toBe(true);
    expect(isValuationType("airline")).toBe(true);
    expect(isValuationType("hotel")).toBe(true);
  });

  test("rejects unknown values", () => {
    expect(isValuationType("resort")).toBe(false);
    expect(isValuationType(null)).toBe(false);
    expect(isValuationType("")).toBe(false);
  });
});

describe("isValuationsSortKey", () => {
  test("accepts name and centsPerPoint", () => {
    expect(isValuationsSortKey("name")).toBe(true);
    expect(isValuationsSortKey("centsPerPoint")).toBe(true);
  });

  test("rejects unknown values", () => {
    expect(isValuationsSortKey("value")).toBe(false);
    expect(isValuationsSortKey(null)).toBe(false);
  });
});

describe("isSortDir", () => {
  test("accepts asc and desc", () => {
    expect(isSortDir("asc")).toBe(true);
    expect(isSortDir("desc")).toBe(true);
  });

  test("rejects unknown values", () => {
    expect(isSortDir("ascending")).toBe(false);
    expect(isSortDir(null)).toBe(false);
  });
});

describe("buildValuationsUrl", () => {
  test("omits every param at the default state", () => {
    const url = buildValuationsUrl("/valuations", { type: null, sortKey: "centsPerPoint", sortDir: "desc" });
    expect(url).toBe("/valuations");
  });

  test("includes only the type param when just the filter changes", () => {
    const url = buildValuationsUrl("/valuations", { type: "bank", sortKey: "centsPerPoint", sortDir: "desc" });
    expect(url).toBe("/valuations?type=bank");
  });

  test("includes sort and dir together when sort is non-default", () => {
    const url = buildValuationsUrl("/valuations", { type: null, sortKey: "name", sortDir: "asc" });
    expect(url).toBe("/valuations?sort=name&dir=asc");
  });

  test("includes sort and dir when only dir differs from the default for the same key", () => {
    const url = buildValuationsUrl("/valuations", { type: null, sortKey: "centsPerPoint", sortDir: "asc" });
    expect(url).toBe("/valuations?sort=centsPerPoint&dir=asc");
  });

  test("combines type and sort params", () => {
    const url = buildValuationsUrl("/valuations", { type: "hotel", sortKey: "name", sortDir: "desc" });
    expect(url).toBe("/valuations?type=hotel&sort=name&dir=desc");
  });
});
