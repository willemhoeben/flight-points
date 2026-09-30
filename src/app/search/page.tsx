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
import { PROGRAMS } from "@/data/programs";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cityName } from "@/lib/i18n/place-names";
import { interpolate, pluralize } from "@/lib/i18n/format";
import { parsePassengers } from "@/lib/passengers";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return {
    title: dict.search.eyebrow,
    description: interpolate(dict.search.description, { count: PROGRAMS.length }),
    alternates: { canonical: "/search" },
    openGraph: {
      title: dict.search.eyebrow,
      description: interpolate(dict.search.description, { count: PROGRAMS.length }),
      url: "/search",
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: { card: "summary_large_image", title: dict.search.eyebrow, description: interpolate(dict.search.description, { count: PROGRAMS.length }) },
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
  const passengers = parsePassengers(firstValue(sp.pax));

  const baseParams = new URLSearchParams();
  baseParams.set("origin", origin);
  baseParams.set("destination", destination);
  baseParams.set("cabin", cabin);
  if (passengers > 1) baseParams.set("pax", String(passengers));
  for (const id of programIds) baseParams.append("programs", id);

  // Award space is per seat, so a row with one seat left is not an option
  // for two people. The prices stay per person, which is how award search
  // is read everywhere; only the availability changes.
  const results = searchAvailability({ origin, destination, date, cabin, programIds }).filter(
    (r) => r.seatsRemaining >= passengers,
  );
  const calendarStart = addDays(date, -3);
  const calendarDays = searchCalendar({
    origin,
    destination,
    cabin,
    startDate: calendarStart,
    days: 14,
    programIds,
    minSeats: passengers,
  });

  const originAirport = findAirport(origin);
  const destinationAirport = findAirport(destination);
  const cabinLabel = dict.cabins[cabin];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <Suspense fallback={null}>
        <SearchMemory />
      </Suspense>
      <SectionHeading eyebrow={dict.search.eyebrow} title={dict.search.title} description={interpolate(dict.search.description, { count: PROGRAMS.length })} />
      <SavedSearchesList />

      <div className="mt-8">
        <SearchForm values={{ origin, destination, date, cabin, passengers, programs: programIds }} dict={dict.searchForm} cabins={dict.cabins} locale={locale} />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-foreground">{dict.search.cheapestDayHeading}</h2>
        <p className="mt-1 text-sm text-muted">
          {interpolate(dict.search.cheapestDaySub, {
            origin: originAirport ? cityName(originAirport, locale) : origin,
            destination: destinationAirport ? cityName(destinationAirport, locale) : destination,
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
              {originAirport ? cityName(originAirport, locale) : origin} ({origin}) → {destinationAirport ? cityName(destinationAirport, locale) : destination} ({destination})
            </h2>
            <p className="mt-1 text-sm text-muted">
              {cabinLabel} · {formatDateLabel(date, locale)} ·{" "}
              {pluralize(results.length, dict.search.resultsCountOne, dict.search.resultsCountOther)}
            </p>
            {passengers > 1 && <p className="mt-1 text-xs text-muted">{dict.search.perPerson}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SaveSearchButton search={{ origin, destination, date, cabin, programs: programIds }} />
            <CopyLinkButton />
          </div>
        </div>
        <div className="mt-4">
          <Suspense fallback={null}>
            <ResultsTable results={results} passengers={passengers} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
