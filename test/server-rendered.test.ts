import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(import.meta.dir, "..", "src");
const APP = path.join(SRC, "app");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const rel = (f: string) => path.relative(path.join(import.meta.dir, ".."), f);

describe("pages reach a reader without JavaScript", () => {
  /**
   * Both of the ways a page here lost its own content, found by loading
   * every route with scripting off and counting the characters inside
   * <main>. /search and /valuations each returned eight.
   *
   * Eight characters is "Loading…". Nothing about it errored, nothing in
   * the browser console complained, and with JavaScript on it was
   * invisible — the real markup arrived a few milliseconds later and
   * swapped itself in. Off, the swap never happens: a crawler, a reader
   * mode, a text browser or anyone with scripting disabled got a skeleton
   * that never resolved, on the two pages that hold the most content.
   */

  /**
   * A `loading.tsx` makes the route's first HTML a skeleton, and the page
   * itself only arrives in a later streamed chunk that script has to
   * splice in. That is a fair trade when a page waits on something slow.
   * None of these do: every page here renders from arrays compiled into
   * the bundle, so the skeleton bought a flash of grey boxes in exchange
   * for the whole page being invisible without JavaScript.
   *
   * If a route ever does wait on real I/O, a loading.tsx is the right
   * answer for it — delete this test's expectation for that one route and
   * say why here. Do not add one for a page that reads compiled-in data.
   */
  test("no route ships a loading skeleton in place of its content", () => {
    const loaders = walk(APP).filter((f) => f.endsWith(`${path.sep}loading.tsx`));
    expect(loaders.map(rel)).toEqual([]);
  });

  /**
   * The second way, and the subtler one. `useSearchParams()` in a client
   * component opts its nearest Suspense boundary out of server rendering:
   * the boundary's fallback is what ships in the HTML, and both of these
   * tables sat behind `fallback={null}`. The heading rendered; the
   * forty-eight currencies and twenty-six results did not.
   *
   * The page already has the URL. Parsing it there and handing the values
   * down as props costs nothing, keeps every filter and sort working the
   * same way, and puts the rows in the markup.
   *
   * Narrow by design: this covers the shared components under src/, where
   * a table or a list is rendered. A small client control that genuinely
   * needs the live URL can still use the hook, but it should sit in its
   * own boundary and own no content worth reading.
   */
  test("no shared component reads the URL with useSearchParams", () => {
    const offenders = walk(path.join(SRC, "components"))
      .filter((f) => /\buseSearchParams\s*\(/.test(fs.readFileSync(f, "utf-8")))
      .map(rel);
    // SearchMemory is named here rather than skipped by a pattern, so a
    // second exception has to be argued for in this file. It returns null:
    // it exists to copy the current search into localStorage and to restore
    // it on a bare /search, and it has no markup to lose.
    expect(offenders).toEqual(["src/components/SearchMemory.tsx"]);
  });

  /**
   * A Suspense boundary with a null fallback renders nothing at all in the
   * HTML when it suspends, which is how both of these failures stayed
   * invisible. A fallback that shows something is a deliberate choice; a
   * fallback that shows nothing is usually a boundary nobody wanted.
   */
  test("no page hides content behind an empty Suspense fallback", () => {
    const offenders = walk(APP)
      .filter((f) => /<Suspense\s+fallback=\{null\}>/.test(fs.readFileSync(f, "utf-8")))
      .map(rel);
    // SearchMemory is the exception and is listed, not excluded by a
    // pattern: it renders nothing by design, writes the last search to
    // localStorage and has no markup to lose.
    expect(offenders).toEqual(["src/app/search/page.tsx"]);
  });
});
