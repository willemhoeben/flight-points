"use client";

import type { ReactNode } from "react";
import { useSavedDeals } from "@/lib/saved-deals-context";
import { useSavedFilter } from "@/lib/saved-filter-context";

export function DealCardVisibility({ slug, children }: { slug: string; children: ReactNode }) {
  const { isSaved } = useSavedDeals();
  const { showSavedOnly } = useSavedFilter();

  if (showSavedOnly && !isSaved(slug)) return null;
  return <>{children}</>;
}
