import type { MetadataRoute } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { SITE_NAME } from "@/lib/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { dict } = await getDictionary();

  return {
    name: `${SITE_NAME} — ${dict.home.badge}`,
    short_name: SITE_NAME,
    description: dict.home.lede,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0071e3",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
