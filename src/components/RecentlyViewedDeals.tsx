"use client";

import Link from "next/link";
import { findDeal } from "@/data/deals";
import { useRecentlyViewed } from "@/lib/recently-viewed-context";

/**
 * Compact link row for deals the visitor opened recently — a passive,
 * auto-tracked complement to the explicit "saved" list. Renders nothing
 * server-side or on an empty history (useSyncExternalStore's server
 * snapshot is []), so there's no server/client existence mismatch to
 * suppress — see saved-deals-context.tsx for the same reasoning.
 */
export function RecentlyViewedDeals({ heading }: { heading: string }) {
  const { recentSlugs } = useRecentlyViewed();
  const deals = recentSlugs.map((slug) => findDeal(slug)).filter((d): d is NonNullable<typeof d> => d !== undefined);

  if (deals.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{heading}</div>
      <div className="flex flex-wrap gap-2">
        {deals.map((deal) => (
          <Link
            key={deal.slug}
            href={`/deals/${deal.slug}`}
            className="rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            {deal.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
