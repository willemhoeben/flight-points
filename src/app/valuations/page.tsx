import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { ValuationsTable } from "@/components/ValuationsTable";
import { PointsCalculator } from "@/components/PointsCalculator";
import { VALUATIONS } from "@/data/valuations";

export const metadata: Metadata = { title: "Points valuations" };

export default function ValuationsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Points valuations"
        title="What your points are worth"
        description="Estimated redemption value in US cents per point for the major bank, airline, and hotel currencies. Illustrative figures, not a live feed — actual value depends on the redemption."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ValuationsTable valuations={VALUATIONS} />
        <PointsCalculator />
      </div>
    </div>
  );
}
