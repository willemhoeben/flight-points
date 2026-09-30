import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import { AIRPORTS, findAirport } from "@/data/airports";
import { CABINS, type Cabin } from "@/data/availability";
import { exploreDestinations, isExploreSort, sortDestinations, type ExploreSort } from "@/lib/explore";
import { addDays, formatCentsPerPoint, formatDateLabel, formatMiles, todayIso } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cityName, countryName } from "@/lib/i18n/place-names";
import { interpolate } from "@/lib/i18n/format";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import { CurrencyAmount } from "@/components/CurrencyAmount";
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

  const startDate = addDays(todayIso(), 30);
  const all = exploreDestinations({ origin, cabin, startDate });
  const withinBudget = budget ? all.filter((r) => r.best.milesCost <= budget) : all;
  const rows = sortDestinations(withinBudget, sort);
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

  const sortHref = (next: ExploreSort) => {
    const params = new URLSearchParams();
    params.set("origin", origin);
    params.set("cabin", cabin);
    if (budgetRaw) params.set("budget", budgetRaw);
    params.set("sort", next);
    return `/explore?${params.toString()}`;
  };

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
        <input type="hidden" name="sort" value={sort} />
        {/* Client-side: the balances live in this browser, so the button
            only exists once there is something to offer. */}
        <UseMyBalance inputId="explore-budget" />
        <button
          type="submit"
          className="w-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 sm:w-auto print:hidden"
        >
          {dict.explore.submit}
        </button>
      </form>

      <div className="mt-10">
        <div className="flex flex-wrap items-center gap-2 print:hidden" role="group" aria-label={dict.common.sortBy}>
          <span className="text-xs font-medium text-muted">{dict.common.sortBy}</span>
          {(["cheapest", "value"] as const).map((key) => (
            <Link
              key={key}
              href={sortHref(key)}
              aria-current={sort === key ? "true" : undefined}
              className={
                sort === key
                  ? "bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground"
                  : "bg-surface-muted px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
              }
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
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows.map(({ airport, best }) => {
              const routeParams = new URLSearchParams({
                origin,
                destination: airport.code,
                date: best.date,
                cabin,
              });
              return (
                <li key={airport.code} className="flex flex-col bg-surface-muted p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-serif text-lg font-semibold leading-tight text-foreground">{cityName(airport, locale)}</div>
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
                    <span className="inline-flex items-center bg-surface px-2 py-0.5 text-[10.5px] font-medium text-muted">
                      {best.direct
                        ? dict.resultsTable.nonstop
                        : `${best.connections} ${best.connections > 1 ? dict.resultsTable.stops : dict.resultsTable.stop}`}
                    </span>
                    {airport.code === bestValueCode && (
                      <span className="inline-block whitespace-nowrap rounded-md bg-tint-emerald px-1.5 py-0.5 text-[10.5px] font-semibold text-ink-emerald">
                        {dict.explore.sortValue}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/search?${routeParams.toString()}`}
                    aria-label={interpolate(dict.explore.viewRouteAria, {
                      origin,
                      destination: airport.code,
                    })}
                    className="mt-3 self-start text-[13px] font-medium text-brand-text hover:underline"
                  >
                    {dict.explore.viewRoute} →
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
