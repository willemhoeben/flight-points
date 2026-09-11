import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui";
import { RecordDealView } from "@/components/RecordDealView";
import { SaveDealButton } from "@/components/SaveDealButton";
import { DEALS, findDeal } from "@/data/deals";
import { formatDateLabel } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { dealCategoryLabel } from "@/lib/i18n/deal-category";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const CATEGORY_ACCENT: Record<string, string> = {
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
  if (deal) {
    return {
      title: deal.title,
      description: deal.summary,
      alternates: { canonical: `/deals/${deal.slug}` },
      openGraph: { title: deal.title, description: deal.summary, url: `/deals/${deal.slug}`, type: "article" },
      twitter: { card: "summary_large_image", title: deal.title, description: deal.summary },
    };
  }
  const { dict } = await getDictionary();
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: deal.title,
    description: deal.summary,
    datePublished: deal.publishedAt,
    ...(deal.expires ? { expires: deal.expires } : {}),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/deals/${deal.slug}`,
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecordDealView slug={deal.slug} />
      <Link href="/deals" className="text-sm font-medium text-brand hover:underline">
        {dict.dealsPage.backToDeals}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge accent={CATEGORY_ACCENT[deal.category]}>{dealCategoryLabel(deal.category, dict.dealsPage)}</Badge>
          {deal.bonusPercent && (
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              +{deal.bonusPercent}% {dict.dealsPage.bonusSuffix}
            </span>
          )}
        </div>
        <SaveDealButton slug={deal.slug} />
      </div>

      <h1 className="mt-3 text-3xl text-foreground">{deal.title}</h1>

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

      {locale !== "en" && <p className="mt-6 text-xs italic text-muted">{dict.dealsPage.englishOnlyNote}</p>}

      <div className="mt-4 space-y-4 text-base leading-7 text-foreground">
        {deal.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-surface-muted p-4 text-xs text-muted">{dict.dealsPage.demoDisclaimer}</div>
    </div>
  );
}
