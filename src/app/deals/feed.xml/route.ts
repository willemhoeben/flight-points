import { DEALS } from "@/data/deals";
import { SITE_NAME, SITE_URL } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  // Deliberately one canonical English feed rather than one that follows
  // the reader's Accept-Language. A feed is a single cacheable document
  // fetched by software that does not carry a person's language
  // preference, so content-negotiating it would mostly mean serving
  // whatever language the first fetch happened to ask for. Per-language
  // feeds would need their own URLs; the channel declares which one this
  // is instead.
  const items = [...DEALS]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .map((deal) => {
      const link = `${SITE_URL}/deals/${deal.slug}`;
      const pubDate = new Date(`${deal.publishedAt}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${escapeXml(deal.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(deal.summary)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Deals</title>
    <link>${SITE_URL}/deals</link>
    <language>en</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_URL}/deals/feed.xml" rel="self" type="application/rss+xml" />
    <description>Transfer bonuses and award-chart sweet spots. Sample editorial content, not a live promotions feed.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
