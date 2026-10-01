import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const APP = path.join(import.meta.dir, "..", "src", "app");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const FILES = walk(APP);

/** Route segments whose page or layout calls notFound(). */
const CALLS_NOT_FOUND = FILES.filter(
  (f) => /\/(page|layout)\.tsx$/.test(f) && /\bnotFound\(\)/.test(fs.readFileSync(f, "utf-8")),
).map((f) => path.dirname(f));

/** Route segments that own a loading.tsx. */
const HAS_LOADING = FILES.filter((f) => f.endsWith("/loading.tsx")).map((f) => path.dirname(f));

describe("notFound() reaches the response status", () => {
  /**
   * A `loading.tsx` wraps its whole subtree in a Suspense boundary. When a
   * page under that boundary calls `notFound()`, React cannot abort the
   * shell that has already been flushed, so Next degrades to a client-side
   * error fallback: the response goes out as HTTP 200 carrying the loading
   * skeleton, and only a browser running JavaScript ever swaps in the
   * not-found page.
   *
   * That is what /deals/<anything> did. Every invented URL under /deals/
   * answered 200 to a crawler, and a visitor without JavaScript sat on a
   * skeleton that never resolved. /definitely-not-a-page answered a correct
   * 404 the whole time, which is what made it easy to miss.
   *
   * These pages render from compiled-in arrays with no I/O, so the skeleton
   * bought nothing in the first place. If a route ever does need one, give
   * it a loading.tsx at a segment that does NOT contain a notFound() call.
   */
  test("no notFound() route sits under a loading.tsx boundary", () => {
    expect(CALLS_NOT_FOUND.length).toBeGreaterThan(0);
    const shadowed = CALLS_NOT_FOUND.filter((routeDir) =>
      HAS_LOADING.some((loadingDir) => routeDir === loadingDir || routeDir.startsWith(`${loadingDir}${path.sep}`)),
    ).map((d) => path.relative(APP, d));
    expect(shadowed).toEqual([]);
  });

  /** A boundary for the client to render the not-found page into. */
  test("every notFound() route can reach a not-found boundary", () => {
    const boundaries = FILES.filter((f) => f.endsWith("/not-found.tsx")).map((f) => path.dirname(f));
    for (const routeDir of CALLS_NOT_FOUND) {
      const reachable = boundaries.some(
        (b) => routeDir === b || routeDir.startsWith(`${b}${path.sep}`),
      );
      expect(reachable, `${path.relative(APP, routeDir)} has no not-found.tsx above it`).toBe(true);
    }
  });
});
