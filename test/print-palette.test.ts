import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const CSS = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf-8");

/** Pulls the `--token: value;` pairs out of one block of the stylesheet. */
function tokensIn(source: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of source.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
    out[name] = value.trim();
  }
  return out;
}

function block(startMarker: string, endMarker: string): string {
  const start = CSS.indexOf(startMarker);
  expect(start, `${startMarker} is gone from globals.css`).toBeGreaterThan(-1);
  const end = CSS.indexOf(endMarker, start);
  expect(end, `${endMarker} is gone from globals.css`).toBeGreaterThan(start);
  return CSS.slice(start, end);
}

/**
 * The body of one rule, found by matching braces rather than by looking for
 * whatever text happens to come next. The dark palette used to end at the
 * literal `* {\n  border-color` of the rule below it, so moving that rule
 * into a layer — a change with nothing to do with palettes — failed this
 * file instead of the one it belonged to.
 */
function ruleBody(selector: string): string {
  const start = CSS.indexOf(selector);
  expect(start, `${selector} is gone from globals.css`).toBeGreaterThan(-1);
  let depth = 0;
  for (let i = CSS.indexOf("{", start); i < CSS.length; i++) {
    if (CSS[i] === "{") depth++;
    else if (CSS[i] === "}" && --depth === 0) return CSS.slice(start, i);
  }
  throw new Error(`${selector} is never closed`);
}

const light = tokensIn(ruleBody(":root {"));
const dark = tokensIn(ruleBody(":root.dark {"));
const print = tokensIn(block("@media print {", "Printers can't scroll"));

/**
 * Printing a page picked up in dark mode forces the daylight palette. That
 * only works if the print block neutralizes EVERY token the night palette
 * overrides — a half-reverted palette prints near-black badge tints onto a
 * white page. Adding a token to one palette and forgetting the print block
 * is exactly the kind of omission nobody notices until someone prints.
 */
describe("print palette", () => {
  test("neutralizes every token the night palette overrides", () => {
    const missing = Object.keys(dark).filter((t) => !(t in print));
    expect(missing, `print block is missing ${missing.join(", ")}`).toEqual([]);
  });

  test("matches the daylight values, except the deliberate paper white", () => {
    const PAPER: Record<string, string> = { "--background": "#ffffff" };
    for (const [token, value] of Object.entries(print)) {
      expect(value, `print --${token} drifted from the daylight palette`).toBe(
        PAPER[token] ?? light[token],
      );
    }
  });

  test("both palettes define exactly the same set of tokens", () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  test("every colour the page can print is a dark ink", () => {
    // Browsers drop backgrounds when printing unless a page asks otherwise,
    // so every text colour has to stand on white by itself.
    const inks = Object.entries(print).filter(
      ([t]) => t.startsWith("--ink-") || t === "--foreground" || t === "--muted" || t.endsWith("-text"),
    );
    expect(inks.length).toBeGreaterThan(5);
    for (const [token, hex] of inks) {
      const n = parseInt(hex.replace("#", ""), 16);
      const luminance = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
      expect(luminance, `print --${token} (${hex}) is too pale for paper`).toBeLessThan(140);
    }
  });
});
