import { describe, expect, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { jsonLdHtml } from "@/lib/json-ld";

describe("jsonLdHtml", () => {
  /**
   * The exploit this exists for. Before the escaper, planting this title on
   * a deal and loading the page set window.__XSS__ — verified in a real
   * browser, not inferred.
   */
  test("a closing script tag cannot break out of the block", () => {
    const html = jsonLdHtml({ headline: "Pwn </script><script>window.x=1</script>" });
    expect(html).not.toContain("</script>");
    expect(html).not.toContain("<script");
    expect(html).toContain("\\u003c/script\\u003e");
  });

  test("escapes every character that can end the block or a JS line", () => {
    const html = jsonLdHtml({ a: "<", b: ">", c: "&", d: "\u2028", e: "\u2029" });
    for (const raw of ["<", ">", "&", "\u2028", "\u2029"]) {
      expect(html, `raw ${JSON.stringify(raw)}`).not.toContain(raw);
    }
  });

  /** Escaped is still valid JSON, and parses back to the original string. */
  test("round-trips through JSON.parse unchanged", () => {
    const value = {
      headline: "A </script> & a <b> tag",
      body: ["line\u2028break", "amp & amp"],
      nested: { deep: "<<>>" },
    };
    expect(JSON.parse(jsonLdHtml(value))).toEqual(value);
  });

  test("leaves ordinary copy alone apart from the escapes", () => {
    expect(JSON.parse(jsonLdHtml({ t: "Reykjavík — 7 nights" }))).toEqual({ t: "Reykjavík — 7 nights" });
  });

  /**
   * A static tripwire, because the risk is a future page adding its own
   * JSON-LD block and reaching for JSON.stringify the way these two did.
   */
  test("no page serialises JSON-LD with a bare JSON.stringify", () => {
    const root = path.join(process.cwd(), "src");
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx?$/.test(entry.name)) {
          const src = fs.readFileSync(full, "utf-8");
          if (/application\/ld\+json/.test(src) && /__html:\s*JSON\.stringify/.test(src)) {
            offenders.push(path.relative(root, full));
          }
        }
      }
    };
    walk(root);
    expect(offenders).toEqual([]);
  });
});
