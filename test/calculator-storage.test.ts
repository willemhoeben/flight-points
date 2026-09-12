import { describe, expect, test } from "bun:test";
import { isCalcMode, parseStoredCalcState } from "@/lib/calculator-storage";

const isValidCurrencyId = (id: string) => id === "chase-ur" || id === "amex-mr";

describe("isCalcMode", () => {
  test("accepts both calculator modes", () => {
    expect(isCalcMode("pointsToCash")).toBe(true);
    expect(isCalcMode("cashToPoints")).toBe(true);
  });

  test("rejects unknown values", () => {
    expect(isCalcMode("other")).toBe(false);
    expect(isCalcMode(null)).toBe(false);
    expect(isCalcMode(undefined)).toBe(false);
    expect(isCalcMode(1)).toBe(false);
  });
});

describe("parseStoredCalcState", () => {
  test("returns null when nothing is stored", () => {
    expect(parseStoredCalcState(null, isValidCurrencyId)).toBeNull();
  });

  test("returns null for invalid JSON", () => {
    expect(parseStoredCalcState("not json", isValidCurrencyId)).toBeNull();
  });

  test("returns null for a JSON value that isn't an object", () => {
    expect(parseStoredCalcState("42", isValidCurrencyId)).toBeNull();
    expect(parseStoredCalcState("null", isValidCurrencyId)).toBeNull();
    expect(parseStoredCalcState('"chase-ur"', isValidCurrencyId)).toBeNull();
  });

  test("parses a fully valid stored state", () => {
    const raw = JSON.stringify({ mode: "cashToPoints", currencyId: "amex-mr", balance: "12345", targetAmount: "99" });
    expect(parseStoredCalcState(raw, isValidCurrencyId)).toEqual({
      mode: "cashToPoints",
      currencyId: "amex-mr",
      balance: "12345",
      targetAmount: "99",
    });
  });

  test("rejects an invalid mode", () => {
    const raw = JSON.stringify({ mode: "sideways", currencyId: "amex-mr", balance: "1", targetAmount: "1" });
    expect(parseStoredCalcState(raw, isValidCurrencyId)).toBeNull();
  });

  test("rejects a currency id the caller says is no longer valid", () => {
    const raw = JSON.stringify({ mode: "pointsToCash", currencyId: "discontinued-program", balance: "1", targetAmount: "1" });
    expect(parseStoredCalcState(raw, isValidCurrencyId)).toBeNull();
  });

  test("rejects non-string balance or targetAmount", () => {
    const badBalance = JSON.stringify({ mode: "pointsToCash", currencyId: "amex-mr", balance: 60000, targetAmount: "1" });
    expect(parseStoredCalcState(badBalance, isValidCurrencyId)).toBeNull();
    const badTarget = JSON.stringify({ mode: "pointsToCash", currencyId: "amex-mr", balance: "1", targetAmount: 500 });
    expect(parseStoredCalcState(badTarget, isValidCurrencyId)).toBeNull();
  });

  test("rejects an object missing a required field", () => {
    const raw = JSON.stringify({ mode: "pointsToCash", currencyId: "amex-mr", balance: "1" });
    expect(parseStoredCalcState(raw, isValidCurrencyId)).toBeNull();
  });
});
