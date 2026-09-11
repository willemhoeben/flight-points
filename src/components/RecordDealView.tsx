"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/recently-viewed-context";

/** Renders nothing — records the current deal as viewed on mount. */
export function RecordDealView({ slug }: { slug: string }) {
  const { recordView } = useRecentlyViewed();

  useEffect(() => {
    recordView(slug);
  }, [slug, recordView]);

  return null;
}
