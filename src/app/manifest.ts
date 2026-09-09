import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — award search & points valuations`,
    short_name: SITE_NAME,
    description:
      "Search award flight availability across loyalty programs and see what your points are actually worth.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0071e3",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
