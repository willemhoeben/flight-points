"use client";

import type { ValueTier } from "@/lib/value";
import { useDictionary } from "@/lib/i18n/i18n-context";

const TIER_CLASSES: Record<ValueTier, string> = {
  great: "bg-emerald-500/10 text-success-text",
  good: "bg-brand/10 text-brand-text",
  fair: "bg-surface-muted text-muted",
  weak: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function ValueBadge({ tier }: { tier: ValueTier | null }) {
  const dict = useDictionary();
  if (!tier) return null;

  const label = {
    great: dict.resultsTable.valueGreat,
    good: dict.resultsTable.valueGood,
    fair: dict.resultsTable.valueFair,
    weak: dict.resultsTable.valueWeak,
  }[tier];

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${TIER_CLASSES[tier]}`}
    >
      {label}
    </span>
  );
}
