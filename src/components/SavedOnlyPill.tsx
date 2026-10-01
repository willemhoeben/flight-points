"use client";

import { Pill } from "@/components/ui";
import { useSavedFilter } from "@/lib/saved-filter-context";

export function SavedOnlyPill({ label }: { label: string }) {
  const { showSavedOnly, toggleShowSavedOnly } = useSavedFilter();

  return (
    <Pill selected={showSavedOnly} semantics="toggle" onClick={toggleShowSavedOnly}>
      ★ {label}
    </Pill>
  );
}
