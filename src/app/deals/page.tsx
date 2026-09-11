import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { SavedDealBadge } from "@/components/SavedDealBadge";
import { SavedOnlyPill } from "@/components/SavedOnlyPill";
import { DealCardVisibility } from "@/components/DealCardVisibility";
import { SavedOnlyEmptyState } from "@/components/SavedOnlyEmptyState";
import { RecentlyViewedDeals } from "@/components/RecentlyViewedDeals";
import { SavedFilterProvider } from "@/lib/saved-filter-context";
import { DEALS, type DealCategory } from "@/data/deals";
import { formatDateLabel } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { dealCategoryLabel } from "@/lib/i18n/deal-category";
import { isDealSort, sortDeals, type DealSort } from "@/lib/deal-sort";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.dealsPage.eyebrow,
    description: dict.dealsPage.description,
    alternates: {
      canonical: "/deals",
      types: { "application/rss+xml": [{ url: "/deals/feed.xml", title: `${dict.dealsPage.eyebrow} RSS` }] },
    },
    openGraph: { title: dict.dealsPage.eyebrow, description: dict.dealsPage.description, url: "/deals", type: "website" },
    twitter: { card: "summary_large_image", title: dict.dealsPage.eyebrow, description: dict.dealsPage.description },
  };
}

const CATEGORY_ACCENT: Record<string, string> = {
  "transfer-bonus": "emerald",
  "sweet-spot": "violet",
  sale: "amber",
};

const CATEGORIES: DealCategory[] = ["transfer-bonus", "sweet-spot", "sale"];
const SORTS: DealSort[] = ["newest", "expiring"];

function isDealCategory(value: string | undefined): value is DealCategory {
  return !!value && (CATEGORIES as string[]).includes(value);
}

function buildHref(category: DealCategory | null, sort: DealSort | null): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/deals?${qs}` : "/deals";
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category: rawCategory, sort: rawSort } = await searchParams;
  const { locale, dict } = await getDictionary();

  const activeCategory = isDealCategory(rawCategory) ? rawCategory : null;
  const activeSort = isDealSort(rawSort) ? rawSort : null;
  const filtered = activeCategory ? DEALS.filter((d) => d.category === activeCategory) : DEALS;
  const deals = sortDeals(filtered, activeSort);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading eyebrow={dict.dealsPage.eyebrow} title={dict.dealsPage.title} description={dict.dealsPage.description} />

      <RecentlyViewedDeals heading={dict.dealsPage.recentlyViewed} />

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={dict.dealsPage.filterLabel}>
        <FilterPill href={buildHref(null, activeSort)} active={!activeCategory}>
          {dict.dealsPage.filterAll}
        </FilterPill>
        {CATEGORIES.map((category) => (
          <FilterPill key={category} href={buildHref(category, activeSort)} active={activeCategory === category}>
            {dealCategoryLabel(category, dict.dealsPage)}
          </FilterPill>
        ))}
      </div>

      <SavedFilterProvider>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={dict.dealsPage.sortLabel}>
          {SORTS.map((sort) => (
            <FilterPill
              key={sort}
              href={buildHref(activeCategory, activeSort === sort ? null : sort)}
              active={activeSort === sort}
            >
              {sort === "newest" ? dict.dealsPage.sortNewest : dict.dealsPage.sortExpiring}
            </FilterPill>
          ))}
          <SavedOnlyPill label={dict.dealsPage.savedOnly} />
        </div>

        {deals.length === 0 ? (
          <div className="mt-8 rounded-[20px] bg-surface-muted p-10 text-center text-sm text-muted">{dict.dealsPage.noDeals}</div>
        ) : (
          <>
            <SavedOnlyEmptyState slugs={deals.map((d) => d.slug)} message={dict.dealsPage.noSavedDeals} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <DealCardVisibility key={deal.slug} slug={deal.slug}>
                  <Link href={`/deals/${deal.slug}`}>
                    <Card className="flex h-full flex-col p-5 transition-transform hover:-translate-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge accent={CATEGORY_ACCENT[deal.category]}>{dealCategoryLabel(deal.category, dict.dealsPage)}</Badge>
                          {deal.bonusPercent && (
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              +{deal.bonusPercent}%
                            </span>
                          )}
                        </div>
                        <SavedDealBadge slug={deal.slug} />
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
                </DealCardVisibility>
              ))}
            </div>
          </>
        )}
      </SavedFilterProvider>
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
