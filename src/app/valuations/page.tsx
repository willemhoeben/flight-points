import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { ValuationsTable } from "@/components/ValuationsTable";
import { PointsCalculator } from "@/components/PointsCalculator";
import { VALUATIONS } from "@/data/valuations";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = { title: "Points valuations" };

export default async function ValuationsPage() {
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow={dict.valuationsPage.eyebrow}
        title={dict.valuationsPage.title}
        description={dict.valuationsPage.description}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ValuationsTable valuations={VALUATIONS} />
        <PointsCalculator />
      </div>
    </div>
  );
}
