import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { DEALS } from "@/data/deals";
import { formatDateLabel } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { dealCategoryLabel } from "@/lib/i18n/deal-category";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.dealsPage.eyebrow };
}

const CATEGORY_ACCENT: Record<string, string> = {
  "transfer-bonus": "emerald",
  "sweet-spot": "violet",
  sale: "amber",
};

export default async function DealsPage() {
  const { locale, dict } = await getDictionary();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow={dict.dealsPage.eyebrow} title={dict.dealsPage.title} description={dict.dealsPage.description} />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DEALS.map((deal) => (
          <Link key={deal.slug} href={`/deals/${deal.slug}`}>
            <Card className="flex h-full flex-col p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <Badge accent={CATEGORY_ACCENT[deal.category]}>{dealCategoryLabel(deal.category, dict.dealsPage)}</Badge>
                {deal.bonusPercent && (
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    +{deal.bonusPercent}%
                  </span>
                )}
              </div>
              <h2 className="mt-3 text-base text-foreground">{deal.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{deal.summary}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted">
                <span>{deal.program}</span>
                {deal.expires && (
                  <span className="font-semibold text-stamp">
                    {dict.dealsPage.expires} {formatDateLabel(deal.expires, locale)}
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
