import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(import.meta.dir, "..", "src");
const UI = path.join(SRC, "components", "ui.tsx");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
}

const rel = (f: string) => path.relative(path.join(import.meta.dir, ".."), f);

describe("a control does not change size when you use it", () => {
  /**
   * Measured, not guessed. Clicking a filter pill used to swap font-medium
   * for font-semibold, and a weight change changes advance widths:
   *
   *   "Best value"      84.6px -> 85.6px, and it shoved "Cheapest" sideways
   *   "transfer bonus" 105.9px -> 107.8px
   *
   * On short labels — All, Bank, Hotel — the difference hid under a pixel,
   * which is why it lasted: the valuations row measured clean while the
   * explore and deals rows moved under the cursor every time.
   *
   * The two states differ by fill, which is a hue AND a luminance change,
   * and by aria-current or aria-pressed. The weight was a third signal, and
   * it cost the row its stability.
   */
  test("the pill states carry no font weight of their own", () => {
    const src = fs.readFileSync(UI, "utf-8");
    for (const name of ["PILL_SELECTED", "PILL_UNSELECTED"]) {
      const m = src.match(new RegExp(`export const ${name} =\\s*\\n?\\s*"([^"]*)"`));
      expect(m, `${name} is not a plain string constant any more`).not.toBeNull();
      const classes = (m as RegExpMatchArray)[1];
      expect(classes, `${name} sets its own weight`).not.toMatch(/\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b/);
    }
    // The shell carries the one weight both states share.
    expect(src).toMatch(/PILL_SHELL =\s*\n?\s*"[^"]*\bfont-medium\b/);
  });

  /**
   * The deeper fix. Three files had the same pair of class strings pasted
   * in, which is how one of them drifted while the others did not. This is
   * the exact contiguous string that was copied around; a styled button
   * like `bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground`
   * does not match it, and should not — a submit button has no unselected
   * state to shift against.
   */
  test("nobody pastes the old selected-pill string back in", () => {
    const offenders = walk(SRC)
      .filter((f) => fs.readFileSync(f, "utf-8").includes("bg-brand font-semibold text-brand-foreground"))
      .map(rel);
    expect(offenders).toEqual([]);
  });

  /**
   * Narrow by construction: a file with BOTH pill fills in it is a file
   * drawing a two-state pill, and it has to take the shared constants
   * rather than its own strings. A single-state pill — the Use my balance
   * button, the recently-viewed links — only ever uses PILL_SHELL and is
   * not covered, because it has nothing to toggle between.
   */
  test("every two-state pill uses the shared classes", () => {
    const offenders: string[] = [];
    for (const f of walk(SRC)) {
      if (f === UI) continue;
      const src = fs.readFileSync(f, "utf-8");
      if (!src.includes("PILL_SHELL")) continue;
      const twoState = src.includes("bg-brand") && src.includes("bg-surface-muted");
      if (twoState && !(src.includes("PILL_SELECTED") && src.includes("PILL_UNSELECTED"))) {
        offenders.push(rel(f));
      }
    }
    expect(offenders).toEqual([]);
  });
});
