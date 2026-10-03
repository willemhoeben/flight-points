import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { ValuationsTable } from "@/components/ValuationsTable";
import { PointsCalculator } from "@/components/PointsCalculator";
import { VALUATIONS } from "@/data/valuations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import {
  isSortDir,
  isValuationsSortKey,
  isValuationType,
  DEFAULT_VALUATIONS_SORT_DIR,
  DEFAULT_VALUATIONS_SORT_KEY,
  type ValuationsSortKey,
} from "@/lib/valuations-url";
import type { SortDir } from "@/lib/sort";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | null {
  return (Array.isArray(value) ? value[0] : value) ?? null;
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return {
    title: dict.valuationsPage.eyebrow,
    description: dict.valuationsPage.description,
    alternates: { canonical: "/valuations" },
    openGraph: {
      title: dict.valuationsPage.eyebrow,
      description: dict.valuationsPage.description,
      url: "/valuations",
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.valuationsPage.eyebrow,
      description: dict.valuationsPage.description,
    },
  };
}

/**
 * The filter and sort come from here, not from useSearchParams inside the
 * table.
 *
 * A client component that calls useSearchParams opts its Suspense boundary
 * out of server rendering, and the fallback is what ships in the HTML. With
 * fallback={null} that meant the page's own markup carried the heading and
 * then nothing: forty-eight currencies, the whole reason the page exists,
 * existed only in the hydration payload. Anything that does not run
 * JavaScript — a crawler, a reader mode, a browser with scripting off — saw
 * an empty page.
 *
 * The page already has these values; handing them down costs nothing and
 * the table renders on the server.
 */
export default async function ValuationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { dict } = await getDictionary();

  const typeParam = firstValue(sp.type);
  const sortParam = firstValue(sp.sort);
  const dirParam = firstValue(sp.dir);
  const typeFilter = isValuationType(typeParam) ? typeParam : null;
  const sortKey: ValuationsSortKey = isValuationsSortKey(sortParam) ? sortParam : DEFAULT_VALUATIONS_SORT_KEY;
  const sortDir: SortDir = isSortDir(dirParam) ? dirParam : DEFAULT_VALUATIONS_SORT_DIR;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading
        eyebrow={dict.valuationsPage.eyebrow}
        title={dict.valuationsPage.title}
        description={dict.valuationsPage.description}
      />

      {/* Two columns only from xl. At lg the 360px calculator left the
          table column at 592px — narrower than the table's own minimum, so
          a laptop got the same sideways scroll a phone used to. */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px] print:grid-cols-1">
        <ValuationsTable
          valuations={VALUATIONS}
          typeFilter={typeFilter}
          sortKey={sortKey}
          sortDir={sortDir}
        />
        <PointsCalculator />
      </div>
    </div>
  );
}
