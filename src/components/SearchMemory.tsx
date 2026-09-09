"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "flight-points:last-search";

/**
 * Renders nothing — just remembers the visitor's last search in
 * localStorage, and redirects a bare /search (no query params) to it.
 * Search results themselves are still server-rendered from the URL, so
 * this only affects which URL a returning visitor lands on.
 */
export function SearchMemory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    if (qs) {
      try {
        localStorage.setItem(STORAGE_KEY, qs);
      } catch {
        // Private browsing or storage disabled — nothing to remember.
      }
      return;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) router.replace(`/search?${saved}`);
    } catch {
      // Nothing saved, or storage unavailable — keep the default search.
    }
  }, [searchParams, router]);

  return null;
}
