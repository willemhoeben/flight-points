import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { NetworkPlot } from "@/components/NetworkPlot";
import { PlaneFlyover } from "@/components/PlaneFlyover";
import { PROGRAMS } from "@/data/programs";
import { AIRPORTS, findAirport } from "@/data/airports";
import { DEALS } from "@/data/deals";
import { VALUATIONS } from "@/data/valuations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { dealCategoryLabel } from "@/lib/i18n/deal-category";
import { dealText } from "@/lib/i18n/deal-text";
import { interpolate } from "@/lib/i18n/format";
import { cityName } from "@/lib/i18n/place-names";
import { WIDEST_NETWORK } from "@/lib/network";

export default async function Home() {
  const { locale, dict } = await getDictionary();
  const topValuations = VALUATIONS.slice(0, 4);
  const heroHub = findAirport(WIDEST_NETWORK.hub);
  const heroProgram = PROGRAMS.find((p) => p.id === WIDEST_NETWORK.programId);
  const heroPlotCaption = interpolate(dict.home.heroPlotCaption, {
    program: heroProgram?.name ?? WIDEST_NETWORK.programId,
    hub: heroHub ? cityName(heroHub, locale) : WIDEST_NETWORK.hub,
    count: WIDEST_NETWORK.count,
  });
  const featuredDeals = DEALS.slice(0, 3);

  // All six destinations, not the three the site opened with. Two of the
  // newer ones — the network map and the wallet — are the least guessable
  // things here, and a landing page that leaves them out of the map is a
  // landing page that hides them.
  const features = [
    { title: dict.home.featureSearchTitle, description: interpolate(dict.home.featureSearchDescription, { count: PROGRAMS.length }), href: "/search", cta: dict.home.featureSearchCta },
    { title: dict.home.featureExploreTitle, description: dict.home.featureExploreDescription, href: "/explore", cta: dict.home.featureExploreCta },
    { title: dict.home.featureNetworkTitle, description: dict.home.featureNetworkDescription, href: "/network", cta: dict.home.featureNetworkCta },
    { title: dict.home.featureValuationsTitle, description: dict.home.featureValuationsDescription, href: "/valuations", cta: dict.home.featureValuationsCta },
    { title: dict.home.featureWalletTitle, description: dict.home.featureWalletDescription, href: "/wallet", cta: dict.home.featureWalletCta },
    { title: dict.home.featureDealsTitle, description: dict.home.featureDealsDescription, href: "/deals", cta: dict.home.featureDealsCta },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <PlaneFlyover />
      {/* Left-ranged, with the drawing beside it rather than a centred stack.
          This site is an instrument for reading routes, and every page except
          this one showed that: the front door was a centred headline over six
          paragraphs of text, which could have been any product. The plot is
          the one thing here that is not generic, so it goes where it is seen
          first. Ranging the type left also gives the page a spine; a centred
          column has nothing for the sections below it to hang off. */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-2 pt-12 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-x-12 gap-y-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge accent="sky">{dict.home.badge}</Badge>
            <h1 className="mt-4 max-w-[15ch] text-[44px] leading-[1.03] tracking-tight text-foreground sm:text-[56px]">
              {dict.home.title}
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg text-muted">
              {interpolate(dict.home.lede, { count: PROGRAMS.length })}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Link
                href="/search"
                className="bg-brand px-6 py-3 text-[15px] font-semibold text-brand-foreground transition-colors hover:bg-brand-strong"
              >
                {dict.home.ctaPrimary}
              </Link>
              <Link href="/valuations" className="px-3 py-3 text-[15px] font-medium text-brand-text hover:underline">
                {dict.home.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Real data, not an illustration: the widest network in the set, at
              true bearing and distance from its hub. The codes and ring
              distances are dropped at this size — none of them would be
              legible, and a circle of unreadable three-letter labels reads as
              noise. The shape is the argument here; /network has the detail. */}
          <Link
            href={`/network?program=${WIDEST_NETWORK.programId}&hub=${WIDEST_NETWORK.hub}`}
            className="group block"
          >
            <NetworkPlot
              programId={WIDEST_NETWORK.programId}
              hub={WIDEST_NETWORK.hub}
              locale={locale}
              label={heroPlotCaption}
              compact
              className="mx-auto w-full max-w-[440px]"
            />
            {/* A figure caption, not a row: at this column width the two
                halves of a justify-between pair wrap into a ragged stack
                that reads as a mistake rather than as a caption. */}
            <div className="mx-auto mt-4 max-w-[440px] font-mono text-[11px] uppercase tracking-[0.1em]">
              <div className="text-muted">{heroPlotCaption}</div>
              <div className="mt-1 text-brand-text group-hover:underline">{dict.home.heroPlotLink}</div>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-y-8 border-y border-border-strong py-8 sm:grid-cols-4">
          <Stat value={`${PROGRAMS.length}`} label={dict.home.statPrograms} />
          <Stat value={`${AIRPORTS.length}`} label={dict.home.statAirports} />
          <Stat value="14-day" label={dict.home.statCalendar} />
          <Stat value={`${VALUATIONS.length}`} label={dict.home.statCurrencies} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
        <div className="grid gap-x-9 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.href} className="flex flex-col py-5">
              <h2 className="text-lg text-foreground">{feature.title}</h2>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{feature.description}</p>
              <Link
                href={feature.href}
                className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-brand-text hover:underline sm:mt-4 sm:min-h-0"
              >
                {feature.cta} ›
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl text-foreground">{dict.home.valuationsHeading}</h2>
          <p className="mt-2 text-base text-muted">{dict.home.valuationsSub}</p>
        </div>
        <div className="mt-8 grid gap-x-9 sm:grid-cols-4">
          {topValuations.map((v) => (
            <Card key={v.id} className="py-5">
              <div className="text-[13px] text-muted">{v.name}</div>
              <div className="mt-2 font-mono text-[26px] font-semibold tracking-tight tabular-nums text-foreground">
                {v.centsPerPoint.toFixed(2)}¢
              </div>
              <div className="mt-0.5 text-xs text-muted">{dict.home.perPoint}</div>
            </Card>
          ))}
        </div>
        <div className="mt-3 sm:mt-6">
          <Link
            href="/valuations"
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-text hover:underline sm:min-h-0"
          >
            {dict.home.valuationsSeeAll}
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl text-foreground">{dict.home.dealsHeading}</h2>
          <p className="mt-2 text-base text-muted">{dict.home.dealsSub}</p>
        </div>
        <div className="mt-8 grid gap-x-9 sm:grid-cols-3">
          {featuredDeals.map((deal) => (
            <Link key={deal.slug} href={`/deals/${deal.slug}`} className="group">
              <Card className="flex h-full flex-col items-start py-5">
                <Badge accent={deal.category === "transfer-bonus" ? "emerald" : deal.category === "sale" ? "amber" : "violet"}>
                  {dealCategoryLabel(deal.category, dict.dealsPage)}
                </Badge>
                <h3 className="mt-3 text-base text-foreground group-hover:text-brand-text">{dealText(deal, locale).title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{dealText(deal, locale).summary}</p>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-3 sm:mt-6">
          <Link
            href="/deals"
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-text hover:underline sm:min-h-0"
          >
            {dict.home.dealsSeeAll}
          </Link>
        </div>
      </section>
    </div>
  );
}

/**
 * The site sets everything read as a measurement in the data face — codes,
 * distances, miles, cents per point. These four were the one exception,
 * rendered in the text face while the valuations figures six inches below
 * them were monospaced, which made the same kind of number look like two
 * different kinds of thing on one page. The label takes the uppercase,
 * letter-spaced treatment every other label on the site uses, so the strip
 * reads as the instrument panel it is rather than four loose numbers.
 */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-[38px] font-medium leading-none tracking-tight tabular-nums text-brand-text">
        {value}
      </div>
      <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">{label}</div>
    </div>
  );
}
