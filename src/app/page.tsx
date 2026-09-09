import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { PROGRAMS } from "@/data/programs";
import { AIRPORTS } from "@/data/airports";
import { DEALS } from "@/data/deals";
import { VALUATIONS } from "@/data/valuations";

const FEATURES = [
  {
    title: "Award search",
    description:
      "Search award availability across 16 airline programs by route, date, and cabin, with a two-week calendar view to spot the cheapest day to fly.",
    href: "/search",
    cta: "Search awards",
  },
  {
    title: "Points valuations",
    description:
      "See an estimated cents-per-point value for every major bank, airline, and hotel currency, plus a calculator to convert a balance into cash-equivalent value.",
    href: "/valuations",
    cta: "See valuations",
  },
  {
    title: "Deals & sweet spots",
    description:
      "Curated writeups on transfer bonuses and award chart sweet spots — the kind of redemptions that are easy to miss if you're not watching closely.",
    href: "/deals",
    cta: "Browse deals",
  },
];

export default function Home() {
  const topValuations = VALUATIONS.slice(0, 4);
  const featuredDeals = DEALS.slice(0, 3);

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-2xl px-4 pb-2 pt-16 text-center sm:px-6 sm:pt-20">
        <Badge accent="sky">Award search + points valuations</Badge>
        <h1 className="mt-4 text-[44px] leading-[1.06] tracking-tight text-foreground sm:text-5xl">
          Find the flight award you didn&apos;t think existed.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          Search miles and points availability across 16 loyalty programs, check what
          your points balance is actually worth, and catch transfer bonuses before
          they expire.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/search"
            className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-brand-foreground transition-colors hover:bg-brand-strong"
          >
            Search award flights
          </Link>
          <Link href="/valuations" className="px-3 py-3 text-[15px] font-medium text-brand hover:underline">
            Value my points ›
          </Link>
        </div>
        <p className="mt-2 text-xs text-muted">
          Demo build — availability and valuations shown are illustrative sample data.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-y-10 rounded-[28px] bg-gradient-to-b from-brand/[0.07] to-surface-muted px-6 py-14 sm:grid-cols-4">
          <Stat value={`${PROGRAMS.length}`} label="loyalty programs" />
          <Stat value={`${AIRPORTS.length}`} label="airports covered" />
          <Stat value="14-day" label="calendar search" />
          <Stat value={`${VALUATIONS.length}`} label="currencies valued" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.href} className="flex flex-col p-7">
              <h2 className="text-lg text-foreground">{feature.title}</h2>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{feature.description}</p>
              <Link href={feature.href} className="mt-4 text-sm font-medium text-brand hover:underline">
                {feature.cta} ›
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl text-foreground">What your points are worth</h2>
          <p className="mt-2 text-base text-muted">Estimated redemption value, updated by category.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {topValuations.map((v) => (
            <Card key={v.id} className="p-6 text-center">
              <div className="text-sm text-muted">{v.name}</div>
              <div className="mt-2 text-[26px] font-semibold tracking-tight text-foreground">
                {v.centsPerPoint.toFixed(2)}¢
              </div>
              <div className="text-xs text-muted">per point</div>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/valuations" className="text-sm font-medium text-brand hover:underline">
            See full table ›
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl text-foreground">Latest deals</h2>
          <p className="mt-2 text-base text-muted">Transfer bonuses and award chart sweet spots.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {featuredDeals.map((deal) => (
            <Link key={deal.slug} href={`/deals/${deal.slug}`}>
              <Card className="flex h-full flex-col p-7 transition-transform hover:-translate-y-0.5">
                <Badge accent={deal.category === "transfer-bonus" ? "emerald" : deal.category === "sale" ? "amber" : "violet"}>
                  {deal.category.replace("-", " ")}
                </Badge>
                <h3 className="mt-3 text-base text-foreground">{deal.title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{deal.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/deals" className="text-sm font-medium text-brand hover:underline">
            All deals ›
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-[40px] font-semibold leading-none tracking-tight text-foreground">{value}</div>
      <div className="mt-3 text-[13px] text-muted">{label}</div>
    </div>
  );
}
