import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const CSS = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf-8");

function tokensIn(source: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of source.matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-f]{6});/g)) {
    out[name] = value;
  }
  return out;
}

const light = tokensIn(CSS.slice(CSS.indexOf(":root {"), CSS.indexOf("@theme inline {")));
const dark = tokensIn(CSS.slice(CSS.indexOf(":root.dark {"), CSS.indexOf("\n* {\n  border-color")));

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The three grounds any interactive element can land on. */
const SURFACES = ["--background", "--surface", "--surface-muted"] as const;

const THEMES: [string, Record<string, string>][] = [
  ["daylight", light],
  ["night", dark],
];

describe("palette contrast", () => {
  test.each(THEMES)("%s: body and muted text clear AA on every surface", (_name, p) => {
    for (const ink of ["--foreground", "--muted", "--brand-text"]) {
      for (const surface of SURFACES) {
        expect(contrast(p[ink], p[surface]), `${ink} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test.each(THEMES)("%s: the success and warning inks clear AA on every surface", (_name, p) => {
    for (const ink of ["--success-text", "--warning-text", "--stamp"]) {
      for (const surface of SURFACES) {
        expect(contrast(p[ink], p[surface]), `${ink} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test.each(THEMES)("%s: every badge ink clears AA on its own tint", (_name, p) => {
    const accents = Object.keys(p)
      .filter((t) => t.startsWith("--ink-"))
      .map((t) => t.slice("--ink-".length));
    expect(accents.length).toBe(8);
    for (const accent of accents) {
      const ratio = contrast(p[`--ink-${accent}`], p[`--tint-${accent}`]);
      expect(ratio, `ink-${accent} on tint-${accent}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  /**
   * WCAG 2.2 asks a focus indicator for 3:1 against what it sits on. axe
   * does not check this, so the keyboard ring is exactly the thing that can
   * quietly fall below the line when a palette changes — which is what the
   * brand amber did on the daylight surfaces before --focus existed.
   */
  test.each(THEMES)("%s: the focus ring clears 3:1 on every surface", (_name, p) => {
    for (const surface of SURFACES) {
      expect(contrast(p["--focus"], p[surface]), `--focus on ${surface}`).toBeGreaterThanOrEqual(3);
    }
  });

  test.each(THEMES)("%s: text on the brand fill clears AA", (_name, p) => {
    expect(contrast(p["--brand-foreground"], p["--brand"])).toBeGreaterThanOrEqual(4.5);
  });
});
