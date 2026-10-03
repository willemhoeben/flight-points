import type { Metadata } from "next";
import Link from "next/link";
import { PILL_SHELL, SectionHeading } from "@/components/ui";
import { AIRPORTS, findAirport } from "@/data/airports";
import { CABINS, type Cabin } from "@/data/availability";
import {
  exploreDestinations,
  filterByRegion,
  isExploreSort,
  sortDestinations,
  summariseByRegion,
  type ExploreSort,
} from "@/lib/explore";
import { isRegion, type Region } from "@/data/regions";
import { PASSENGER_OPTIONS, parsePassengers } from "@/lib/passengers";
import { addDays, formatCentsPerPoint, formatDateLabel, formatMiles, todayIso } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cityName, countryName } from "@/lib/i18n/place-names";
import { interpolate } from "@/lib/i18n/format";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import { CurrencyAmount } from "@/components/CurrencyAmount";
import { AffordBadge } from "@/components/AffordBadge";
import { UseMyBalance } from "@/components/UseMyBalance";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return {
    title: dict.explore.title,
    description: dict.explore.description,
    alternates: { canonical: "/explore" },
    openGraph: {
      title: dict.explore.title,
      description: dict.explore.description,
      url: "/explore",
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: { card: "summary_large_image", title: dict.explore.title, description: dict.explore.description },
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isValidAirport(code: string | undefined): code is string {
  return !!code && AIRPORTS.some((a) => a.code === code);
}

function isValidCabin(cabin: string | undefined): cabin is Cabin {
  return !!cabin && CABINS.some((c) => c.id === cabin);
}

/** Free-form numeric input; anything that isn't a positive number means "no budget". */
function parseBudget(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { locale, dict } = await getDictionary();

  const origin = isValidAirport(firstValue(sp.origin)) ? (firstValue(sp.origin) as string) : "JFK";
  const cabin: Cabin = isValidCabin(firstValue(sp.cabin)) ? (firstValue(sp.cabin) as Cabin) : "business";
  const budgetRaw = firstValue(sp.budget) ?? "";
  const budget = parseBudget(budgetRaw);
  const sort: ExploreSort = isExploreSort(firstValue(sp.sort)) ? (firstValue(sp.sort) as ExploreSort) : "cheapest";
  const passengers = parsePassengers(firstValue(sp.pax));

  const region = isRegion(firstValue(sp.region)) ? (firstValue(sp.region) as Region) : null;

  const startDate = addDays(todayIso(), 30);
  // Award space is per seat, so a party of four is shown only the
  // destinations the search would also show them.
  const all = exploreDestinations({ origin, cabin, startDate, minSeats: passengers });
  const withinBudget = budget ? all.filter((r) => r.best.milesCost <= budget) : all;
  // Summarised before the region filter is applied, so choosing a region
  // never repaints the other rows of the summary. A table whose numbers
  // change when you click one of them cannot be compared against itself.
  const regionSummaries = summariseByRegion(withinBudget);
  const rows = sortDestinations(filterByRegion(withinBudget, region), sort);
  // One marker rather than a graded badge. Every card here prices a different
  // seat, so any scale is either mostly red or mostly green and says nothing;
  // naming the single best-value destination cannot be miscalibrated.
  const bestValueCode = rows.reduce<string | null>(
    (best, r) =>
      best === null ||
      r.best.centsPerPoint > (rows.find((x) => x.airport.code === best)?.best.centsPerPoint ?? 0)
        ? r.airport.code
        : best,
    null,
  );

  const originAirport = findAirport(origin);
  const meta = budget
    ? interpolate(dict.explore.within, {
        count: withinBudget.length,
        total: all.length,
        miles: formatMiles(budget, locale),
      })
    : interpolate(dict.explore.allFound, {
        count: all.length,
        origin: originAirport ? cityName(originAirport, locale) : origin,
      });

  const hrefWith = (overrides: { sort?: ExploreSort; region?: Region | null }) => {
    const params = new URLSearchParams();
    params.set("origin", origin);
    params.set("cabin", cabin);
    if (budgetRaw) params.set("budget", budgetRaw);
    if (passengers > 1) params.set("pax", String(passengers));
    params.set("sort", overrides.sort ?? sort);
    const nextRegion = "region" in overrides ? overrides.region : region;
    if (nextRegion) params.set("region", nextRegion);
    return `/explore?${params.toString()}`;
  };
  const sortHref = (next: ExploreSort) => hrefWith({ sort: next });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading
        eyebrow={dict.explore.eyebrow}
        title={dict.explore.title}
        description={dict.explore.description}
      />

      {/* Plain GET form, like the search form: every result is server-rendered
          and the URL is the whole state, so a set of destinations is shareable. */}
      <form method="get" action="/explore" className="mt-8 space-y-4">
        {/* The submit sits in the row as its own auto column from lg, the way
            the network form does, instead of alone underneath with a
            thousand pixels of nothing beside it. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-foreground">{dict.searchForm.from}</span>
            <select name="origin" defaultValue={origin} className="form-select">
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {cityName(a, locale)} ({a.code})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-foreground">{dict.searchForm.cabin}</span>
            <select name="cabin" defaultValue={cabin} className="form-select">
              {CABINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {dict.cabins[c.id]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-foreground">{dict.searchForm.passengers}</span>
            <select name="pax" defaultValue={String(passengers)} className="form-select">
              {PASSENGER_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-foreground">{dict.explore.budgetLabel}</span>
            <input
              id="explore-budget"
              type="text"
              inputMode="numeric"
              name="budget"
              defaultValue={budgetRaw}
              placeholder={dict.explore.budgetPlaceholder}
              className="form-select"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 lg:w-auto print:hidden"
          >
            {dict.explore.submit}
          </button>
        </div>
        <input type="hidden" name="sort" value={sort} />
        {/* Client-side: the balances live in this browser, so the button
            only exists once there is something to offer. */}
        <UseMyBalance inputId="explore-budget" />
      </form>

      {/* The answer to the question in the heading, before the list that
          enumerates it.

          A hundred and four cities sorted by price is not an answer to
          "where can I go with my points": you learn that Boston is cheap,
          and nineteen thousand pixels later that Auckland is not, and never
          that Europe opens at 55,000 while Asia does not start until 85,000.
          That second fact is the one that decides a trip, and award charts
          are printed by region precisely because it is.

          Each row is also the filter. One element doing both jobs: you read
          "Europe, 24 destinations, from 55,000", and the same row is what
          you press to see those twenty-four. A separate pill row saying the
          same region names twice would be the clutter this page already had
          once. */}
      {regionSummaries.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-foreground">{dict.explore.regionsHeading}</h2>
          <ul className="mt-3 grid gap-x-9 sm:grid-cols-2 lg:grid-cols-3">
            <RegionRow
              href={hrefWith({ region: null })}
              name={dict.explore.regionsAll}
              count={withinBudget.length}
              fromMiles={withinBudget.length ? Math.min(...withinBudget.map((r) => r.best.milesCost)) : 0}
              bestCentsPerPoint={withinBudget.length ? Math.max(...withinBudget.map((r) => r.best.centsPerPoint)) : 0}
              selected={region === null}
              sort={sort}
              dict={dict}
              locale={locale}
            />
            {regionSummaries.map((s) => (
              <RegionRow
                key={s.region}
                href={hrefWith({ region: s.region })}
                name={dict.regions[s.region]}
                count={s.count}
                fromMiles={s.fromMiles}
                bestCentsPerPoint={s.bestCentsPerPoint}
                selected={region === s.region}
                sort={sort}
                dict={dict}
                locale={locale}
              />
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10">
        <div className="flex flex-wrap items-center gap-2 print:hidden" role="group" aria-label={dict.common.sortBy}>
          <span className="text-xs font-medium text-muted">{dict.common.sortBy}</span>
          {(["cheapest", "value"] as const).map((key) => (
            <Link
              key={key}
              href={sortHref(key)}
              aria-current={sort === key ? "true" : undefined}
              className={`${PILL_SHELL} ${
                sort === key
                  ? "bg-brand font-semibold text-brand-foreground"
                  : "bg-surface-muted font-medium text-muted transition-colors hover:text-foreground"
              }`}
            >
              {key === "cheapest" ? dict.explore.sortCheapest : dict.explore.sortValue}
            </Link>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">{meta}</p>

        {rows.length === 0 ? (
          <div className="mt-4 bg-surface-muted p-10 text-center text-sm text-muted">
            {budget
              ? interpolate(dict.explore.none, { miles: formatMiles(budget, locale) })
              : dict.search.noAwardSpace}
          </div>
        ) : (
          <ul className="mt-4 grid gap-x-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows.map(({ airport, best }) => {
              const routeParams = new URLSearchParams({
                origin,
                destination: airport.code,
                date: best.date,
                cabin,
              });
              // The card was priced for this party, so the search it opens
              // is too; otherwise following it would widen the result back
              // out to seats the card never promised.
              if (passengers > 1) routeParams.set("pax", String(passengers));
              return (
                // The whole card is the link. It used to carry a separate
                // "View this route" line, which meant a hundred-odd identical
                // amber links down the page — the only repeated colour on it,
                // shouting over the city names and prices you actually read.
                // Same pattern the deals teaser already uses: wrap the card,
                // let the heading carry the hover.
                <li key={airport.code} className="border-t border-border-strong">
                  <Link
                    href={`/search?${routeParams.toString()}`}
                    aria-label={interpolate(dict.explore.viewRouteAria, {
                      origin,
                      destination: airport.code,
                    })}
                    className="group flex flex-col py-4 transition-colors hover:bg-surface"
                  >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[17px] font-semibold leading-tight text-foreground group-hover:text-brand-text">
                        {cityName(airport, locale)}
                        {/* A persistent mark, not a hover state: on a phone
                            there is no hover, so without it nothing says the
                            card goes anywhere. */}
                        <span aria-hidden="true" className="ml-1.5 font-mono text-[13px] text-muted">
                          →
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted">
                        {countryName(airport, locale)} · {airport.code}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-base font-medium tabular-nums text-foreground" suppressHydrationWarning>
                        {formatMiles(best.milesCost, locale)}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] tabular-nums text-muted" suppressHydrationWarning>
                        + <CurrencyAmount usd={best.taxesFeesUsd} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[13px] leading-snug text-muted">
                    {best.programName}
                    <br />
                    {interpolate(dict.explore.cheapestOn, { date: formatDateLabel(best.date, locale) })}
                  </div>

                  <div className="mt-2 font-mono text-[11.5px] text-muted" suppressHydrationWarning>
                    {formatCentsPerPoint(best.centsPerPoint, locale)} · {dict.resultsTable.cashFare}{" "}
                    <CurrencyAmount usd={best.cashFareUsd} rounded />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center bg-surface-muted px-2 py-0.5 text-[10.5px] font-medium text-muted">
                      {best.direct
                        ? dict.resultsTable.nonstop
                        : `${best.connections} ${best.connections > 1 ? dict.resultsTable.stops : dict.resultsTable.stop}`}
                    </span>
                    {airport.code === bestValueCode && (
                      <span className="inline-block whitespace-nowrap rounded-md bg-tint-emerald px-1.5 py-0.5 text-[10.5px] font-semibold text-ink-emerald">
                        {dict.explore.sortValue}
                      </span>
                    )}
                    {/* The page's whole question is "where can I go with my
                        points", so once balances exist each card can answer
                        it outright instead of leaving the reader to check
                        the number against a balance in their head. */}
                    <AffordBadge programId={best.programId} milesCost={best.milesCost * passengers} />
                  </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * One region, read as a line: the name, how many destinations it holds, the
 * cheapest way in, and the best your points are worth there.
 *
 * The figures are set in the data face and the names in the text face,
 * because that is what they are. The selected row takes the left rule that
 * marks the current item everywhere else on this site rather than a fill,
 * since a filled row in a list of nine reads as a different kind of thing
 * rather than as the one you chose.
 */
function RegionRow({
  href,
  name,
  count,
  fromMiles,
  bestCentsPerPoint,
  selected,
  sort,
  dict,
  locale,
}: {
  href: string;
  name: string;
  count: number;
  fromMiles: number;
  bestCentsPerPoint: number;
  selected: boolean;
  sort: ExploreSort;
  dict: Awaited<ReturnType<typeof getDictionary>>["dict"];
  locale: Awaited<ReturnType<typeof getDictionary>>["locale"];
}) {
  return (
    <li className="border-t border-border-strong">
      <Link
        href={href}
        aria-current={selected ? "true" : undefined}
        className={`group flex min-h-11 items-baseline justify-between gap-3 py-3 pl-3 transition-colors hover:bg-surface ${
          selected ? "border-l-2 border-brand bg-surface" : "border-l-2 border-transparent"
        }`}
      >
        <div className="min-w-0">
          <div
            className={`text-[15px] font-semibold leading-tight group-hover:text-brand-text ${
              selected ? "text-brand-text" : "text-foreground"
            }`}
          >
            {name}
          </div>
          <div className="mt-0.5 text-xs text-muted" suppressHydrationWarning>
            {interpolate(count === 1 ? dict.explore.regionDestinationsOne : dict.explore.regionDestinations, {
              count,
            })}
          </div>
        </div>
        {/* One figure, the one that answers the question you asked.
            Printing both the cheapest way in and the best value in the
            region put two unlabelled numbers side by side in a row that has
            no column headings to tell them apart: a reader saw "22,000" and
            "4.3 ¢" and had to guess what the second one was. The sort
            control above already says which of the two you are after, so
            the row says that one. */}
        <div
          className="shrink-0 font-mono text-[13px] tabular-nums text-foreground"
          suppressHydrationWarning
        >
          {sort === "cheapest"
            ? interpolate(dict.explore.regionFrom, { miles: formatMiles(fromMiles, locale) })
            : interpolate(dict.explore.regionUpTo, {
                cents: formatCentsPerPoint(bestCentsPerPoint, locale),
              })}
        </div>
      </Link>
    </li>
  );
}
