import type { ValueTier } from "@/lib/value";

const TIER_CLASSES: Record<ValueTier, string> = {
  great: "bg-emerald-500/10 text-success-text",
  good: "bg-brand/10 text-brand-text",
  fair: "bg-surface-muted text-muted",
  weak: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

/**
 * Presentational and server-safe: the caller supplies the label, so both the
 * client results table and the server-rendered explore page can use it
 * without one of them dragging a dictionary hook across the boundary.
 */
export function ValueBadge({ tier, label }: { tier: ValueTier | null; label: string }) {
  if (!tier) return null;
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${TIER_CLASSES[tier]}`}
    >
      {label}
    </span>
  );
}

/** Picks the right translated label out of the results-table dictionary. */
export function valueTierLabel(
  tier: ValueTier,
  dict: { valueGreat: string; valueGood: string; valueFair: string; valueWeak: string },
): string {
  return { great: dict.valueGreat, good: dict.valueGood, fair: dict.valueFair, weak: dict.valueWeak }[tier];
}
