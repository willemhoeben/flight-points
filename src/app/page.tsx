import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { PlaneFlyover } from "@/components/PlaneFlyover";
import { PROGRAMS } from "@/data/programs";
import { AIRPORTS } from "@/data/airports";
import { DEALS } from "@/data/deals";
import { VALUATIONS } from "@/data/valuations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { dealCategoryLabel } from "@/lib/i18n/deal-category";

export default async function Home() {
  const { dict } = await getDictionary();
  const topValuations = VALUATIONS.slice(0, 4);
  const featuredDeals = DEALS.slice(0, 3);

  const features = [
    { title: dict.home.featureSearchTitle, description: dict.home.featureSearchDescription, href: "/search", cta: dict.home.featureSearchCta },
    { title: dict.home.featureValuationsTitle, description: dict.home.featureValuationsDescription, href: "/valuations", cta: dict.home.featureValuationsCta },
    { title: dict.home.featureDealsTitle, description: dict.home.featureDealsDescription, href: "/deals", cta: dict.home.featureDealsCta },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <PlaneFlyover />
      <section className="mx-auto w-full max-w-2xl px-4 pb-2 pt-12 text-center sm:px-6 sm:pt-14">
        <Badge accent="sky">{dict.home.badge}</Badge>
        <h1 className="mt-4 text-[44px] leading-[1.06] tracking-tight text-foreground sm:text-5xl">
          {dict.home.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">{dict.home.lede}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/search"
            className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-brand-foreground transition-colors hover:bg-brand-strong"
          >
            {dict.home.ctaPrimary}
          </Link>
          <Link href="/valuations" className="px-3 py-3 text-[15px] font-medium text-brand hover:underline">
            {dict.home.ctaSecondary}
          </Link>
        </div>
        <p className="mt-2 text-xs text-muted">{dict.home.demoNote}</p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-y-8 rounded-[28px] bg-gradient-to-b from-brand/[0.07] to-surface-muted px-6 py-10 sm:grid-cols-4">
          <Stat value={`${PROGRAMS.length}`} label={dict.home.statPrograms} />
          <Stat value={`${AIRPORTS.length}`} label={dict.home.statAirports} />
          <Stat value="14-day" label={dict.home.statCalendar} />
          <Stat value={`${VALUATIONS.length}`} label={dict.home.statCurrencies} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.href} className="flex flex-col p-6">
              <h2 className="text-lg text-foreground">{feature.title}</h2>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{feature.description}</p>
              <Link href={feature.href} className="mt-4 text-sm font-medium text-brand hover:underline">
                {feature.cta} ›
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl text-foreground">{dict.home.valuationsHeading}</h2>
          <p className="mt-2 text-base text-muted">{dict.home.valuationsSub}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {topValuations.map((v) => (
            <Card key={v.id} className="p-5 text-center">
              <div className="text-sm text-muted">{v.name}</div>
              <div className="mt-2 text-[26px] font-semibold tracking-tight text-foreground">
                {v.centsPerPoint.toFixed(2)}¢
              </div>
              <div className="text-xs text-muted">{dict.home.perPoint}</div>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/valuations" className="text-sm font-medium text-brand hover:underline">
            {dict.home.valuationsSeeAll}
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl text-foreground">{dict.home.dealsHeading}</h2>
          <p className="mt-2 text-base text-muted">{dict.home.dealsSub}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {featuredDeals.map((deal) => (
            <Link key={deal.slug} href={`/deals/${deal.slug}`}>
              <Card className="flex h-full flex-col p-6 transition-transform hover:-translate-y-0.5">
                <Badge accent={deal.category === "transfer-bonus" ? "emerald" : deal.category === "sale" ? "amber" : "violet"}>
                  {dealCategoryLabel(deal.category, dict.dealsPage)}
                </Badge>
                <h3 className="mt-3 text-base text-foreground">{deal.title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{deal.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/deals" className="text-sm font-medium text-brand hover:underline">
            {dict.home.dealsSeeAll}
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
