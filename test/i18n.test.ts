import { describe, expect, test } from "bun:test";
import { interpolate, pluralize } from "@/lib/i18n/format";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { LOCALES } from "@/lib/i18n/locales";

describe("interpolate", () => {
  test("replaces a single placeholder", () => {
    expect(interpolate("Hello {name}", { name: "World" })).toBe("Hello World");
  });

  test("replaces multiple placeholders", () => {
    expect(interpolate("{a} + {b} = {c}", { a: 1, b: 2, c: 3 })).toBe("1 + 2 = 3");
  });

  test("leaves unmatched placeholders untouched", () => {
    expect(interpolate("Hello {name}", {})).toBe("Hello {name}");
  });

  test("is a no-op when the template has no placeholders", () => {
    expect(interpolate("plain text", { unused: "value" })).toBe("plain text");
  });
});

describe("pluralize", () => {
  test("picks the singular form for a count of 1", () => {
    expect(pluralize(1, "{count} result", "{count} results")).toBe("1 result");
  });

  test("picks the plural form for any other count", () => {
    expect(pluralize(0, "{count} result", "{count} results")).toBe("0 results");
    expect(pluralize(2, "{count} result", "{count} results")).toBe("2 results");
    expect(pluralize(100, "{count} result", "{count} results")).toBe("100 results");
  });
});

function extractPlaceholders(template: string): string[] {
  return [...template.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

describe("dictionaries: placeholder consistency across locales", () => {
  // TypeScript's Dictionary type guarantees every locale has the same KEYS,
  // but not that a translated string keeps the same {placeholder} tokens as
  // the English original — a translator (or an LLM) could drop or misspell
  // one. Walk every string leaf and compare placeholder sets against en.
  function collectLeaves(obj: unknown, path: string, out: Map<string, string>) {
    if (typeof obj === "string") {
      out.set(path, obj);
      return;
    }
    if (obj && typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        collectLeaves(value, path ? `${path}.${key}` : key, out);
      }
    }
  }

  const enLeaves = new Map<string, string>();
  collectLeaves(dictionaries.en, "", enLeaves);

  for (const locale of LOCALES) {
    if (locale === "en") continue;

    test(`${locale}: every placeholder-bearing string matches en's placeholders`, () => {
      const localeLeaves = new Map<string, string>();
      collectLeaves(dictionaries[locale], "", localeLeaves);

      for (const [path, enValue] of enLeaves) {
        const enPlaceholders = extractPlaceholders(enValue);
        if (enPlaceholders.length === 0) continue;

        const localeValue = localeLeaves.get(path);
        expect(localeValue, `missing key ${path} in ${locale}`).toBeDefined();
        expect(extractPlaceholders(localeValue as string), `placeholder mismatch at ${path} in ${locale}`).toEqual(
          enPlaceholders,
        );
      }
    });
  }
});
