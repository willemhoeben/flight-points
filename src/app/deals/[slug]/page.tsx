import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecordDealView } from "@/components/RecordDealView";
import { SaveDealButton } from "@/components/SaveDealButton";
import { DEALS, findDeal, type DealCategory } from "@/data/deals";
import { formatDateLabel } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { dealCategoryLabel } from "@/lib/i18n/deal-category";
import { dealText } from "@/lib/i18n/deal-text";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Accent } from "@/lib/accent";

const CATEGORY_ACCENT: Record<DealCategory, Accent> = {
  "transfer-bonus": "emerald",
  "sweet-spot": "violet",
  sale: "amber",
};

export function generateStaticParams() {
  return DEALS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const deal = findDeal(slug);
  const { locale, dict } = await getDictionary();
  if (deal) {
    const text = dealText(deal, locale);
    return {
      title: text.title,
      description: text.summary,
      alternates: { canonical: `/deals/${deal.slug}` },
      openGraph: {
        title: text.title,
        description: text.summary,
        url: `/deals/${deal.slug}`,
        type: "article",
        locale: toOgLocale(locale),
        alternateLocale: alternateOgLocales(locale),
      },
      twitter: { card: "summary_large_image", title: text.title, description: text.summary },
    };
  }
  return { title: dict.notFound.title };
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deal = findDeal(slug);
  if (!deal) notFound();

  const { locale, dict } = await getDictionary();

  const text = dealText(deal, locale);
  // Newest first, minus this one. DEALS is already in publication order.
  const others = DEALS.filter((d) => d.slug !== deal.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: text.title,
    description: text.summary,
    datePublished: deal.publishedAt,
    ...(deal.expires ? { expires: deal.expires } : {}),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/deals/${deal.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.common.home, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: dict.dealsPage.eyebrow, item: `${SITE_URL}/deals` },
      { "@type": "ListItem", position: 3, name: text.title, item: `${SITE_URL}/deals/${deal.slug}` },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-9 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <RecordDealView slug={deal.slug} />
      <Breadcrumbs
        ariaLabel={dict.common.breadcrumb}
        items={[
          { label: dict.common.home, href: "/" },
          { label: dict.dealsPage.eyebrow, href: "/deals" },
          { label: text.title },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge accent={CATEGORY_ACCENT[deal.category]}>{dealCategoryLabel(deal.category, dict.dealsPage)}</Badge>
          {deal.bonusPercent && (
            <span className="text-sm font-semibold text-success-text">
              +{deal.bonusPercent}% {dict.dealsPage.bonusSuffix}
            </span>
          )}
        </div>
        <SaveDealButton slug={deal.slug} />
      </div>

      <h1 className="mt-3 text-3xl text-foreground">
        {text.title}
      </h1>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span>{deal.program}</span>
        <span>
          {dict.dealsPage.published} {formatDateLabel(deal.publishedAt, locale)}
        </span>
        {deal.expires && (
          <span className="font-semibold text-stamp">
            {dict.dealsPage.expires} {formatDateLabel(deal.expires, locale)}
          </span>
        )}
      </div>

      {/* Capped by character count rather than by the page column: the
          column is 768px wide, which runs prose out to roughly ninety
          characters a line, well past where the eye starts losing its
          place returning to the left edge. */}
      <div className="mt-4 max-w-[64ch] space-y-4 text-base leading-7 text-foreground">
        {text.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* An article used to be a dead end: the breadcrumb was the only way
          onward. */}
      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="border-b border-border-strong pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            {dict.dealsPage.moreDeals}
          </h2>
          <ul>
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/deals/${other.slug}`}
                  className="group flex items-baseline justify-between gap-4 border-b border-border py-3"
                >
                  <span className="text-[15px] font-medium text-foreground group-hover:text-brand-text">
                    {dealText(other, locale).title}
                  </span>
                  <span className="shrink-0 font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted">
                    {dealCategoryLabel(other.category, dict.dealsPage)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
