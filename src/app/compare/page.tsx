import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui";
import { CompareTool } from "@/components/CompareTool";
import { VALUATIONS } from "@/data/valuations";
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

export default async function ComparePage() {
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading
        eyebrow={dict.comparePage.eyebrow}
        title={dict.comparePage.title}
        description={dict.comparePage.description}
      />

      <div className="mt-8">
        <Suspense fallback={null}>
          <CompareTool valuations={VALUATIONS} />
        </Suspense>
      </div>
    </div>
  );
}
