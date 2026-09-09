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
      <section className="border-b border-border bg-gradient-to-b from-brand/5 to-transparent">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <Badge accent="sky">Award search + points valuations</Badge>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Find the flight award you didn&apos;t think existed.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Search miles and points availability across 16 loyalty programs, check what
            your points balance is actually worth, and catch transfer bonuses before
            they expire.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/search"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Search award flights
            </Link>
            <Link
              href="/valuations"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
            >
              Value my points
            </Link>
          </div>
          <p className="text-xs text-muted">
            Demo build — availability and valuations shown are illustrative sample data.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            <Stat value={`${PROGRAMS.length}`} label="loyalty programs" />
            <Stat value={`${AIRPORTS.length}`} label="airports covered" />
            <Stat value="14-day" label="calendar search" />
            <Stat value={`${VALUATIONS.length}`} label="currencies valued" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.href} className="flex flex-col p-6">
              <h2 className="text-lg font-semibold text-foreground">{feature.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{feature.description}</p>
              <Link
                href={feature.href}
                className="mt-4 text-sm font-semibold text-brand hover:underline"
              >
                {feature.cta} →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-foreground">What your points are worth</h2>
              <p className="mt-1 text-sm text-muted">Estimated redemption value, updated by category.</p>
            </div>
            <Link href="/valuations" className="text-sm font-semibold text-brand hover:underline">
              See full table →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {topValuations.map((v) => (
              <Card key={v.id} className="p-5">
                <div className="text-sm font-medium text-muted">{v.name}</div>
                <div className="mt-2 text-2xl font-bold text-foreground">
                  {v.centsPerPoint.toFixed(2)}¢
                </div>
                <div className="text-xs text-muted">per point</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Latest deals</h2>
            <p className="mt-1 text-sm text-muted">Transfer bonuses and award chart sweet spots.</p>
          </div>
          <Link href="/deals" className="text-sm font-semibold text-brand hover:underline">
            All deals →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {featuredDeals.map((deal) => (
            <Link key={deal.slug} href={`/deals/${deal.slug}`}>
              <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                <Badge accent={deal.category === "transfer-bonus" ? "emerald" : deal.category === "sale" ? "amber" : "violet"}>
                  {deal.category.replace("-", " ")}
                </Badge>
                <h3 className="mt-3 text-base font-semibold text-foreground">{deal.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{deal.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-foreground sm:text-3xl">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
