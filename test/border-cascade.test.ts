import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const CSS = fs.readFileSync(path.join(import.meta.dir, "..", "src", "app", "globals.css"), "utf-8");

/**
 * Walks the file tracking brace depth and which `@layer` block, if any, we
 * are inside. Good enough for this one file: it has no strings containing
 * braces and no nested at-rules inside a layer other than `@media`.
 */
function unlayeredSelectors(css: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let layerDepth: number | null = null;
  let buffer = "";

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") {
      const head = buffer.trim().replace(/\/\*[\s\S]*?\*\//g, "").trim();
      depth++;
      if (/^@layer\b/.test(head) && layerDepth === null) layerDepth = depth;
      // A selector at the top level of the file, outside any layer.
      else if (depth === 1 && layerDepth === null && head && !head.startsWith("@")) out.push(head);
      buffer = "";
      continue;
    }
    if (ch === "}") {
      if (layerDepth === depth) layerDepth = null;
      depth--;
      buffer = "";
      continue;
    }
    buffer += ch;
  }
  return out;
}

describe("globals.css cascade", () => {
  /**
   * The bug this exists for: `* { border-color: var(--border) }` sat outside
   * every layer. Unlayered CSS beats everything inside a layer, so that one
   * rule silently overrode every border-colour utility in the app —
   * `border-border-strong` rendered as plain `--border` on fourteen elements
   * of the homepage alone, `hover:border-brand` and `focus:border-focus` did
   * nothing, and `border-transparent` was not transparent. No error, no
   * warning, nothing obviously broken on screen.
   */
  test("no universal or bare-element selector sits outside a layer", () => {
    const offenders = unlayeredSelectors(CSS).filter((sel) =>
      sel
        .split(",")
        .map((s) => s.trim())
        .some((s) => s === "*" || /^[a-z][a-z0-9]*(\s*,|$)/.test(s)),
    );
    expect(offenders).toEqual([]);
  });

  test("the border-colour default is inside a layer", () => {
    expect(unlayeredSelectors(CSS)).not.toContain("*");
    expect(CSS).toMatch(/@layer base \{[\s\S]*?\*\s*\{\s*border-color:\s*var\(--border\)/);
  });

  /** The parser has to actually find things, or the tests above pass vacuously. */
  test("the walker finds the unlayered rules that are fine", () => {
    const found = unlayeredSelectors(CSS);
    expect(found.length).toBeGreaterThan(0);
    expect(found).toContain(".plane-flyover");
  });

  test("the walker catches a reintroduced bare rule", () => {
    expect(unlayeredSelectors(`${CSS}\n* { border-color: red; }\n`)).toContain("*");
  });
});
