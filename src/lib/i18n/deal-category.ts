import type { DealCategory } from "@/data/deals";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function dealCategoryLabel(category: DealCategory, dict: Dictionary["dealsPage"]): string {
  if (category === "transfer-bonus") return dict.categoryTransferBonus;
  if (category === "sale") return dict.categorySale;
  return dict.categorySweetSpot;
}
