import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { ValuationsTable } from "@/components/ValuationsTable";
import { PointsCalculator } from "@/components/PointsCalculator";
import { VALUATIONS } from "@/data/valuations";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.valuationsPage.eyebrow,
    description: dict.valuationsPage.description,
    alternates: { canonical: "/valuations" },
    openGraph: {
      title: dict.valuationsPage.eyebrow,
      description: dict.valuationsPage.description,
      url: "/valuations",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.valuationsPage.eyebrow,
      description: dict.valuationsPage.description,
    },
  };
}

export default async function ValuationsPage() {
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading
        eyebrow={dict.valuationsPage.eyebrow}
        title={dict.valuationsPage.title}
        description={dict.valuationsPage.description}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px] print:grid-cols-1">
        <ValuationsTable valuations={VALUATIONS} />
        <PointsCalculator />
      </div>
    </div>
  );
}
