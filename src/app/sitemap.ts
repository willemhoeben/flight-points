import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { DEALS } from "@/data/deals";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/valuations`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/deals`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const dealRoutes: MetadataRoute.Sitemap = DEALS.map((deal) => ({
    url: `${SITE_URL}/deals/${deal.slug}`,
    lastModified: deal.publishedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...dealRoutes];
}
