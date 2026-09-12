import { describe, expect, test } from "bun:test";
import { buildCompareUrl, DEFAULT_COMPARE_BALANCE, isValidBalance, parseBalance, toggleCompareId } from "@/lib/compare-url";

describe("isValidBalance", () => {
  test("accepts a positive numeric string", () => {
    expect(isValidBalance("60000")).toBe(true);
    expect(isValidBalance("1")).toBe(true);
    expect(isValidBalance("12.5")).toBe(true);
  });

  test("rejects zero, negative, non-numeric, and empty values", () => {
    expect(isValidBalance("0")).toBe(false);
    expect(isValidBalance("-100")).toBe(false);
    expect(isValidBalance("abc")).toBe(false);
    expect(isValidBalance("")).toBe(false);
    expect(isValidBalance(null)).toBe(false);
  });
});

describe("parseBalance", () => {
  test("parses a valid numeric string", () => {
    expect(parseBalance("100000")).toBe(100000);
  });

  test("falls back to the default for invalid input", () => {
    expect(parseBalance("not-a-number")).toBe(DEFAULT_COMPARE_BALANCE);
    expect(parseBalance("-5")).toBe(DEFAULT_COMPARE_BALANCE);
    expect(parseBalance(null)).toBe(DEFAULT_COMPARE_BALANCE);
  });
});

describe("toggleCompareId", () => {
  test("adds an id that isn't selected yet", () => {
    expect(toggleCompareId([], "chase-ur")).toEqual(["chase-ur"]);
    expect(toggleCompareId(["chase-ur"], "amex-mr")).toEqual(["chase-ur", "amex-mr"]);
  });

  test("removes an id that's already selected", () => {
    expect(toggleCompareId(["chase-ur"], "chase-ur")).toEqual([]);
    expect(toggleCompareId(["chase-ur", "amex-mr"], "chase-ur")).toEqual(["amex-mr"]);
  });

  test("never mutates the input array", () => {
    const original = ["chase-ur", "amex-mr"];
    const copy = [...original];
    toggleCompareId(original, "chase-ur");
    toggleCompareId(original, "hyatt");
    expect(original).toEqual(copy);
  });
});

describe("buildCompareUrl", () => {
  test("resolves to a bare pathname with no selection at the default balance", () => {
    expect(buildCompareUrl("/compare", { currencyIds: [], balance: DEFAULT_COMPARE_BALANCE })).toBe("/compare");
  });

  test("adds repeated currencies params in selection order", () => {
    const url = buildCompareUrl("/compare", { currencyIds: ["chase-ur", "amex-mr"], balance: DEFAULT_COMPARE_BALANCE });
    expect(url).toBe("/compare?currencies=chase-ur&currencies=amex-mr");
  });

  test("adds balance only when it differs from the default", () => {
    const url = buildCompareUrl("/compare", { currencyIds: ["chase-ur"], balance: 100000 });
    expect(url).toBe("/compare?currencies=chase-ur&balance=100000");
  });

  test("omits balance when it matches the default even with a selection", () => {
    const url = buildCompareUrl("/compare", { currencyIds: ["chase-ur"], balance: DEFAULT_COMPARE_BALANCE });
    expect(url).toBe("/compare?currencies=chase-ur");
  });
});
