import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { DEALS, type DealCategory } from "@/data/deals";
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

const CATEGORIES: DealCategory[] = ["transfer-bonus", "sweet-spot", "sale"];

function isDealCategory(value: string | undefined): value is DealCategory {
  return !!value && (CATEGORIES as string[]).includes(value);
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const { locale, dict } = await getDictionary();

  const activeCategory = isDealCategory(rawCategory) ? rawCategory : null;
  const deals = activeCategory ? DEALS.filter((d) => d.category === activeCategory) : DEALS;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow={dict.dealsPage.eyebrow} title={dict.dealsPage.title} description={dict.dealsPage.description} />

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={dict.dealsPage.filterLabel}>
        <FilterPill href="/deals" active={!activeCategory}>
          {dict.dealsPage.filterAll}
        </FilterPill>
        {CATEGORIES.map((category) => (
          <FilterPill key={category} href={`/deals?category=${category}`} active={activeCategory === category}>
            {dealCategoryLabel(category, dict.dealsPage)}
          </FilterPill>
        ))}
      </div>

      {deals.length === 0 ? (
        <div className="mt-8 rounded-[20px] bg-surface-muted p-10 text-center text-sm text-muted">{dict.dealsPage.noDeals}</div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
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
      )}
    </div>
  );
}

function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={
        active
          ? "rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
          : "rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}
