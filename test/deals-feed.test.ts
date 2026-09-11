import { describe, expect, test } from "bun:test";
import { GET } from "@/app/deals/feed.xml/route";
import { DEALS } from "@/data/deals";

describe("GET /deals/feed.xml", () => {
  test("returns valid RSS XML with the right content type", async () => {
    const res = await GET();
    expect(res.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    const body = await res.text();
    expect(body.startsWith("<?xml")).toBe(true);
    expect(body).toContain('<rss version="2.0">');
  });

  test("includes exactly one <item> per deal", async () => {
    const res = await GET();
    const body = await res.text();
    const itemCount = (body.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(DEALS.length);
  });

  test("every deal's permalink and (XML-escaped) title appear in the feed", async () => {
    const res = await GET();
    const body = await res.text();
    for (const deal of DEALS) {
      expect(body).toContain(`/deals/${deal.slug}`);
      const escapedTitle = deal.title.replace(/&/g, "&amp;").replace(/'/g, "&apos;");
      expect(body).toContain(escapedTitle);
    }
  });

  test("items are sorted newest first", async () => {
    const res = await GET();
    const body = await res.text();
    const slugsInOrder = [...body.matchAll(/<guid isPermaLink="true">[^<]*\/deals\/([^<]+)<\/guid>/g)].map(
      (m) => m[1],
    );
    const expectedOrder = [...DEALS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)).map((d) => d.slug);
    expect(slugsInOrder).toEqual(expectedOrder);
  });

  test("has no unescaped ampersands outside of valid XML entities", async () => {
    const res = await GET();
    const body = await res.text();
    const bareAmpersands = body.match(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g);
    expect(bareAmpersands).toBeNull();
  });
});
