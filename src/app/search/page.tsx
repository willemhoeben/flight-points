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
import { cheapestRoundTrip, nightsAway, parseLeg, resolveTripDates } from "@/lib/trip";
import { LegSwitch } from "@/components/LegSwitch";
import { RoundTripSummary } from "@/components/RoundTripSummary";
import { NearbyAirports, type NearbyOption } from "@/components/NearbyAirports";
import { nearbyRoutes } from "@/lib/nearby";
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

/** ISO dates sort lexically, so the later of two is just the larger string. */
function maxDate(a: string, b: string): string {
  return a > b ? a : b;
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
  const trip = resolveTripDates(date, firstValue(sp.ret), isValidDateParam);
  // A leg the trip does not have cannot be the one on screen.
  const leg = trip.returnDate ? parseLeg(firstValue(sp.leg)) : "outbound";

  const baseParams = new URLSearchParams();
  baseParams.set("origin", origin);
  baseParams.set("destination", destination);
  baseParams.set("cabin", cabin);
  if (passengers > 1) baseParams.set("pax", String(passengers));
  for (const id of programIds) baseParams.append("programs", id);

  // Award space is per seat, so a row with one seat left is not an option
  // for two people. The prices stay per person, which is how award search
  // is read everywhere; only the availability changes.
  const seats = (r: { seatsRemaining: number }) => r.seatsRemaining >= passengers;
  const outboundResults = searchAvailability({ origin, destination, date, cabin, programIds }).filter(seats);
  const returnResults = trip.returnDate
    ? searchAvailability({
        origin: destination,
        destination: origin,
        date: trip.returnDate,
        cabin,
        programIds,
      }).filter(seats)
    : [];

  const showingReturn = leg === "return";
  const results = showingReturn ? returnResults : outboundResults;
  const shownOrigin = showingReturn ? destination : origin;
  const shownDestination = showingReturn ? origin : destination;
  const shownDate = showingReturn ? (trip.returnDate as string) : date;

  const roundTrip = trip.returnDate ? cheapestRoundTrip(outboundResults, returnResults) : null;

  // The return leg's calendar opens on the departure rather than three days
  // before the return, because a day before the outbound is not a trip.
  const calendarStart = showingReturn ? maxDate(addDays(shownDate, -3), date) : addDays(date, -3);
  const calendarDays = searchCalendar({
    origin: shownOrigin,
    destination: shownDestination,
    cabin,
    startDate: calendarStart,
    days: 14,
    programIds,
    minSeats: passengers,
  });

  // A calendar cell moves the date of whichever leg is on screen, and
  // leaves the other one where it is.
  const calendarParams = new URLSearchParams(baseParams);
  if (showingReturn) {
    calendarParams.set("date", date);
    calendarParams.set("leg", "return");
  } else if (trip.returnDate) {
    calendarParams.set("ret", trip.returnDate);
  }

  // Award space is released per airport, so the gateway next door often has
  // what this one does not. Priced on the same day as the leg on screen, so
  // the comparison is like for like.
  const cheapestHere = results.length > 0 ? results[0].milesCost : null;
  const nearbyOptions: NearbyOption[] = nearbyRoutes(shownOrigin, shownDestination)
    .map((route) => {
      const rows = searchAvailability({
        origin: route.origin,
        destination: route.destination,
        date: shownDate,
        cabin,
        programIds,
      }).filter(seats);
      const milesCost = rows.length > 0 ? rows[0].milesCost : null;

      // The pair above is in the terms of the leg on screen, so on the
      // return leg it has to go back into the trip's own origin and
      // destination the other way round.
      const params = new URLSearchParams(baseParams);
      params.set("origin", showingReturn ? route.destination : route.origin);
      params.set("destination", showingReturn ? route.origin : route.destination);
      params.set("date", date);
      if (trip.returnDate) params.set("ret", trip.returnDate);
      if (showingReturn) params.set("leg", "return");

      return {
        origin: route.origin,
        destination: route.destination,
        km: route.km,
        milesCost,
        savedMiles: milesCost !== null && cheapestHere !== null ? Math.max(0, cheapestHere - milesCost) : 0,
        swappedCode: route.swapped === "origin" ? route.origin : route.destination,
        replacesCode: route.swapped === "origin" ? shownOrigin : shownDestination,
        href: `/search?${params.toString()}`,
      };
    })
    // Cheapest first, and the ones with nothing released last: a gateway
    // that came back empty is still worth reporting, just not worth leading
    // with.
    .sort((a, b) => (a.milesCost ?? Infinity) - (b.milesCost ?? Infinity));

  const originAirport = findAirport(shownOrigin);
  const destinationAirport = findAirport(shownDestination);
  const cabinLabel = dict.cabins[cabin];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <Suspense fallback={null}>
        <SearchMemory />
      </Suspense>
      <SectionHeading eyebrow={dict.search.eyebrow} title={dict.search.title} description={interpolate(dict.search.description, { count: PROGRAMS.length })} />
      <SavedSearchesList />

      <div className="mt-8">
        <SearchForm
          values={{ origin, destination, date, returnDate: trip.returnDate ?? "", cabin, passengers, programs: programIds }}
          dict={dict.searchForm}
          cabins={dict.cabins}
          locale={locale}
        />
      </div>

      {/* A return date that cannot be flown is dropped, not repaired — but
          never silently, or the page reads as a one-way search nobody asked
          for with nothing to say why. */}
      {trip.issue && (
        <p className="mt-4 border-t border-border-strong pt-3 text-sm text-brand-text">
          {trip.issue === "before-departure"
            ? interpolate(dict.search.returnIgnoredEarly, {
                date: formatDateLabel(firstValue(sp.ret) as string, locale),
              })
            : dict.search.returnIgnoredBad}
        </p>
      )}

      {trip.returnDate && (
        <div className="mt-8">
          {roundTrip ? (
            <RoundTripSummary
              heading={dict.search.roundTripHeading}
              total={dict.search.roundTripTotal}
              milesCost={roundTrip.milesCost}
              taxesFeesUsd={roundTrip.taxesFeesUsd}
              programLine={
                roundTrip.sameProgram
                  ? interpolate(dict.search.roundTripSameProgram, { program: roundTrip.outbound.programName })
                  : interpolate(dict.search.roundTripTwoPrograms, {
                      outbound: roundTrip.outbound.programName,
                      inbound: roundTrip.inbound.programName,
                    })
              }
              nights={pluralize(
                nightsAway(date, trip.returnDate),
                dict.search.nightsOne,
                dict.search.nightsOther,
              )}
            />
          ) : (
            <p className="border-t border-border-strong pt-3 text-sm text-muted">{dict.search.roundTripNone}</p>
          )}
        </div>
      )}

      {trip.returnDate && (
        <div className="mt-8">
          <LegSwitch
            leg={leg}
            baseParams={baseParams}
            departure={date}
            returnDate={trip.returnDate}
            labels={{ group: dict.search.legLabel, outbound: dict.search.legOutbound, back: dict.search.legReturn }}
            locale={locale}
          />
        </div>
      )}

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
            selectedDate={shownDate}
            baseParams={calendarParams}
            dateParam={showingReturn ? "ret" : "date"}
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
              {originAirport ? cityName(originAirport, locale) : shownOrigin} ({shownOrigin}) → {destinationAirport ? cityName(destinationAirport, locale) : shownDestination} ({shownDestination})
            </h2>
            <p className="mt-1 text-sm text-muted">
              {cabinLabel} · {formatDateLabel(shownDate, locale)} ·{" "}
              {pluralize(results.length, dict.search.resultsCountOne, dict.search.resultsCountOther)}
            </p>
            {passengers > 1 && <p className="mt-1 text-xs text-muted">{dict.search.perPerson}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SaveSearchButton search={{ origin, destination, date, returnDate: trip.returnDate, cabin, programs: programIds }} />
            <CopyLinkButton />
          </div>
        </div>
        <div className="mt-4">
          <Suspense fallback={null}>
            <ResultsTable results={results} passengers={passengers} />
          </Suspense>
        </div>
      </div>

      <NearbyAirports options={nearbyOptions} dict={dict.search} locale={locale} />
    </div>
  );
}
