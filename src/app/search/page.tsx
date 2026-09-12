import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui";
import { SearchForm } from "@/components/SearchForm";
import { ResultsTable } from "@/components/ResultsTable";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { SearchMemory } from "@/components/SearchMemory";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { SaveSearchButton } from "@/components/SaveSearchButton";
import { SavedSearchesList } from "@/components/SavedSearchesList";
import { AIRPORTS, findAirport } from "@/data/airports";
import { CABINS, searchAvailability, searchCalendar, type Cabin } from "@/data/availability";
import { addDays, formatDateLabel, todayIso } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate, pluralize } from "@/lib/i18n/format";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return {
    title: dict.search.eyebrow,
    description: dict.search.description,
    alternates: { canonical: "/search" },
    openGraph: {
      title: dict.search.eyebrow,
      description: dict.search.description,
      url: "/search",
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: { card: "summary_large_image", title: dict.search.eyebrow, description: dict.search.description },
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isValidAirport(code: string | undefined): code is string {
  return !!code && AIRPORTS.some((a) => a.code === code);
}

function isValidCabin(cabin: string | undefined): cabin is Cabin {
  return !!cabin && CABINS.some((c) => c.id === cabin);
}

// Every other search param above is validated against a known set; date is
// free-form user input. Without this, a non-ISO or unparseable ?date= value
// reaches addDays()'s toISOString() call downstream and throws, crashing
// the page into the generic error boundary instead of falling back like
// every other invalid param does.
function isValidDateParam(value: string | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { locale, dict } = await getDictionary();

  const origin = isValidAirport(firstValue(sp.origin)) ? (firstValue(sp.origin) as string) : "JFK";
  const destination = isValidAirport(firstValue(sp.destination))
    ? (firstValue(sp.destination) as string)
    : "LHR";
  const cabin: Cabin = isValidCabin(firstValue(sp.cabin)) ? (firstValue(sp.cabin) as Cabin) : "business";
  const date = isValidDateParam(firstValue(sp.date)) ? (firstValue(sp.date) as string) : addDays(todayIso(), 30);
  const programIds = toArray(sp.programs);

  const baseParams = new URLSearchParams();
  baseParams.set("origin", origin);
  baseParams.set("destination", destination);
  baseParams.set("cabin", cabin);
  for (const id of programIds) baseParams.append("programs", id);

  const results = searchAvailability({ origin, destination, date, cabin, programIds });
  const calendarStart = addDays(date, -3);
  const calendarDays = searchCalendar({
    origin,
    destination,
    cabin,
    startDate: calendarStart,
    days: 14,
    programIds,
  });

  const originAirport = findAirport(origin);
  const destinationAirport = findAirport(destination);
  const cabinLabel = dict.cabins[cabin];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <Suspense fallback={null}>
        <SearchMemory />
      </Suspense>
      <SectionHeading eyebrow={dict.search.eyebrow} title={dict.search.title} description={dict.search.description} />
      <SavedSearchesList />

      <div className="mt-8">
        <SearchForm values={{ origin, destination, date, cabin, programs: programIds }} dict={dict.searchForm} cabins={dict.cabins} />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-foreground">{dict.search.cheapestDayHeading}</h2>
        <p className="mt-1 text-sm text-muted">
          {interpolate(dict.search.cheapestDaySub, {
            origin: originAirport?.city ?? origin,
            destination: destinationAirport?.city ?? destination,
          })}
        </p>
        <div className="mt-4">
          <CalendarHeatmap
            days={calendarDays}
            selectedDate={date}
            baseParams={baseParams}
            noAwardSpaceLabel={dict.search.noAwardSpaceAria}
            milesLabel={dict.resultsTable.miles}
            locale={locale}
          />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {originAirport?.city ?? origin} ({origin}) → {destinationAirport?.city ?? destination} ({destination})
            </h2>
            <p className="mt-1 text-sm text-muted">
              {cabinLabel} · {formatDateLabel(date, locale)} ·{" "}
              {pluralize(results.length, dict.search.resultsCountOne, dict.search.resultsCountOther)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SaveSearchButton search={{ origin, destination, date, cabin, programs: programIds }} />
            <CopyLinkButton />
          </div>
        </div>
        <div className="mt-4">
          <Suspense fallback={null}>
            <ResultsTable results={results} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
