import { describe, expect, test } from "bun:test";
import { buildCsp, createNonce } from "../src/lib/csp";

function directives(csp: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const part of csp.split(";")) {
    const [name, ...values] = part.trim().split(/\s+/);
    if (name) map.set(name, values);
  }
  return map;
}

describe("buildCsp", () => {
  test("carries the nonce it was given", () => {
    const d = directives(buildCsp("abc123"));
    expect(d.get("script-src")).toContain("'nonce-abc123'");
  });

  /**
   * The bug this guards is the one that shipped broken once: `script-src`
   * omitted, on the belief that an absent directive leaves scripts alone. It
   * does not — it inherits `default-src`, which blocked every inline script
   * on every page, the pre-paint theme script included.
   */
  test("names script-src explicitly rather than inheriting default-src", () => {
    const d = directives(buildCsp(createNonce()));
    expect(d.has("default-src")).toBe(true);
    expect(d.has("script-src")).toBe(true);
  });

  test("never allows inline script", () => {
    const script = directives(buildCsp(createNonce())).get("script-src") ?? [];
    expect(script).not.toContain("'unsafe-inline'");
    expect(script).not.toContain("'unsafe-eval'");
  });

  /**
   * Without this, a browser that honours `'strict-dynamic'` still refuses the
   * route chunks Next's bootstrap injects, because those tags carry no nonce.
   */
  test("trusts what the nonced script loads", () => {
    expect(directives(buildCsp(createNonce())).get("script-src")).toContain("'strict-dynamic'");
  });

  test("pins the directives an injected script would need to be useful", () => {
    const d = directives(buildCsp(createNonce()));
    expect(d.get("connect-src")).toEqual(["'self'"]);
    expect(d.get("base-uri")).toEqual(["'self'"]);
    expect(d.get("form-action")).toEqual(["'self'"]);
    expect(d.get("object-src")).toEqual(["'none'"]);
    expect(d.get("frame-ancestors")).toEqual(["'none'"]);
  });

  test("a nonce is never reused and is long enough to be unguessable", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const nonce = createNonce();
      // 16 random bytes, base64. Anything shorter is guessable within a
      // page's lifetime, which is the whole point of the value.
      expect(nonce.length).toBeGreaterThanOrEqual(22);
      expect(seen.has(nonce)).toBe(false);
      seen.add(nonce);
    }
  });

  test("the nonce needs no quoting inside the header", () => {
    for (let i = 0; i < 200; i++) {
      // base64 can emit `+`, `/` and `=`; a `;` or a space or a quote would
      // let a nonce split the header into a directive of its own.
      expect(createNonce()).toMatch(/^[A-Za-z0-9+/=]+$/);
    }
  });
});
