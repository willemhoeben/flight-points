"use client";

import { useSavedDeals } from "@/lib/saved-deals-context";

/**
 * Read-only "saved" indicator for a deal card. Always renders the same
 * <span> on server and client (only the visibility class differs) so the
 * client-only saved state doesn't create an appear/disappear hydration
 * mismatch — see SaveDealButton for the same className-toggle pattern.
 */
export function SavedDealBadge({ slug }: { slug: string }) {
  const { isSaved } = useSavedDeals();
  const saved = isSaved(slug);

  return (
    <span
      aria-hidden="true"
      suppressHydrationWarning
      className={saved ? "shrink-0 text-lg leading-none text-brand" : "hidden"}
    >
      ★
    </span>
  );
}
