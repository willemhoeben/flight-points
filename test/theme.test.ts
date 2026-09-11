import { describe, expect, test } from "bun:test";
import { isTheme, resolveIsDark, THEMES } from "@/lib/theme";

describe("isTheme", () => {
  test("accepts every listed theme", () => {
    for (const theme of THEMES) {
      expect(isTheme(theme)).toBe(true);
    }
  });

  test("rejects unknown values", () => {
    expect(isTheme("blue")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
    expect(isTheme("")).toBe(false);
  });
});

describe("resolveIsDark", () => {
  test("explicit dark is always dark, regardless of system preference", () => {
    expect(resolveIsDark("dark", true)).toBe(true);
    expect(resolveIsDark("dark", false)).toBe(true);
  });

  test("explicit light is always light, regardless of system preference", () => {
    expect(resolveIsDark("light", true)).toBe(false);
    expect(resolveIsDark("light", false)).toBe(false);
  });

  test("system follows the OS preference", () => {
    expect(resolveIsDark("system", true)).toBe(true);
    expect(resolveIsDark("system", false)).toBe(false);
  });
});
