import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { DEALS } from "@/data/deals";
import { findProgram } from "@/data/programs";
import { formatDateLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Deals" };

const CATEGORY_ACCENT: Record<string, string> = {
  "transfer-bonus": "emerald",
  "sweet-spot": "violet",
  sale: "amber",
};

export default function DealsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Deals"
        title="Transfer bonuses & sweet spots"
        description="Curated writeups on the redemptions worth knowing about. Sample editorial content, not a live promotions feed."
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DEALS.map((deal) => {
          const program = findProgram(deal.programId);
          return (
            <Link key={deal.slug} href={`/deals/${deal.slug}`}>
              <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <Badge accent={CATEGORY_ACCENT[deal.category]}>{deal.category.replace("-", " ")}</Badge>
                  {deal.bonusPercent && (
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      +{deal.bonusPercent}%
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-base font-semibold text-foreground">{deal.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted">{deal.summary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <span>{program?.name ?? deal.programId}</span>
                  {deal.expires && <span>Expires {formatDateLabel(deal.expires)}</span>}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
