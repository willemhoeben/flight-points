import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui";
import { DEALS, findDeal } from "@/data/deals";
import { findProgram } from "@/data/programs";
import { formatDateLabel } from "@/lib/format";

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
  return { title: deal?.title ?? "Deal not found" };
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deal = findDeal(slug);
  if (!deal) notFound();

  const program = findProgram(deal.programId);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/deals" className="text-sm font-medium text-brand hover:underline">
        ← All deals
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <Badge accent={CATEGORY_ACCENT[deal.category]}>{deal.category.replace("-", " ")}</Badge>
        {deal.bonusPercent && (
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            +{deal.bonusPercent}% bonus
          </span>
        )}
      </div>

      <h1 className="mt-3 text-3xl text-foreground">{deal.title}</h1>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span>{program?.name ?? deal.programId}</span>
        <span>Published {formatDateLabel(deal.publishedAt)}</span>
        {deal.expires && <span className="font-semibold text-stamp">Expires {formatDateLabel(deal.expires)}</span>}
      </div>

      <div className="mt-8 space-y-4 text-base leading-7 text-foreground">
        {deal.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-surface-muted p-4 text-xs text-muted">
        Sample editorial content for demo purposes — not a live promotions feed.
      </div>
    </div>
  );
}
