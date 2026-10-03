import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { CompareTool } from "@/components/CompareTool";
import { VALUATIONS } from "@/data/valuations";
import { parseBalance } from "@/lib/compare-url";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return {
    title: dict.comparePage.eyebrow,
    description: dict.comparePage.description,
    alternates: { canonical: "/compare" },
    openGraph: {
      title: dict.comparePage.eyebrow,
      description: dict.comparePage.description,
      url: "/compare",
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: { card: "summary_large_image", title: dict.comparePage.eyebrow, description: dict.comparePage.description },
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ComparePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { dict } = await getDictionary();

  // Read here rather than with useSearchParams in the tool: that hook opts
  // its Suspense boundary out of server rendering, and the page then
  // answered a reader without JavaScript with a heading and nothing else.
  const requestedIds = Array.isArray(sp.currencies)
    ? sp.currencies
    : sp.currencies
      ? [sp.currencies]
      : [];
  const balanceParam = Array.isArray(sp.balance) ? sp.balance[0] : sp.balance;
  const balance = parseBalance(balanceParam ?? null);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading
        eyebrow={dict.comparePage.eyebrow}
        title={dict.comparePage.title}
        description={dict.comparePage.description}
      />

      <div className="mt-8">
        <CompareTool valuations={VALUATIONS} requestedIds={requestedIds} balance={balance} />
      </div>
    </div>
  );
}
