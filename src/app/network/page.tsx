import type { Metadata } from "next";
import Link from "next/link";
import { ProgramReach } from "@/components/ProgramReach";
import { SectionHeading } from "@/components/ui";
import { findAirport } from "@/data/airports";
import { PROGRAMS } from "@/data/programs";
import { NETWORKS, hubsFor, type Region } from "@/data/networks";
import { byRegion, networkFrom } from "@/lib/network";
import { NetworkPlot } from "@/components/NetworkPlot";
import { addDays, formatMiles, todayIso } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cityName } from "@/lib/i18n/place-names";
import { interpolate } from "@/lib/i18n/format";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return {
    title: dict.network.title,
    description: dict.network.description,
    alternates: { canonical: "/network" },
    openGraph: {
      title: dict.network.title,
      description: dict.network.description,
      url: "/network",
      type: "website",
      locale: toOgLocale(locale),
      alternateLocale: alternateOgLocales(locale),
    },
    twitter: { card: "summary_large_image", title: dict.network.title, description: dict.network.description },
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const REGION_KEY: Record<Region, keyof Dictionary["network"]> = {
  "North America": "northAmerica",
  "Latin America": "latinAmerica",
  Europe: "europe",
  "Middle East": "middleEast",
  Africa: "africa",
  Asia: "asia",
  Oceania: "oceania",
};


export default async function NetworkPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { locale, dict } = await getDictionary();

  const askedProgram = firstValue(sp.program);
  const programId = askedProgram && NETWORKS[askedProgram] ? askedProgram : "united";
  const program = PROGRAMS.find((p) => p.id === programId);
  const hubs = hubsFor(programId);
  const askedHub = firstValue(sp.hub);
  // A hub that belongs to another airline falls back to this one's first hub,
  // which is what happens when someone switches programme in the plain GET
  // form and the old hub rides along in the URL.
  const hub = askedHub && hubs.includes(askedHub) ? askedHub : hubs[0];
  // Switching programme in a plain GET form carries the old hub along in the
  // URL, and the page then quietly shows a different one. Saying so beats
  // letting someone wonder why they are looking at Dubai.
  const fellBack = !!askedHub && askedHub !== hub;

  const legs = networkFrom(programId, hub);
  const groups = byRegion(legs);
  const hubAirport = findAirport(hub);
  const hubLabel = hubAirport ? cityName(hubAirport, locale) : hub;
  const programName = program?.name ?? programId;
  const date = addDays(todayIso(), 30);

  const meta = interpolate(dict.network.meta, {
    program: programName,
    count: legs.length,
    hub: hubLabel,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6">
      <SectionHeading
        eyebrow={dict.network.eyebrow}
        title={dict.network.title}
        description={dict.network.description}
      />

      {/* Plain GET form: the URL is the whole state, so one airline's map is
          a shareable link. */}
      <form method="get" action="/network" className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">{dict.network.programLabel}</span>
          <select name="program" defaultValue={programId} className="form-select">
            {PROGRAMS.filter((p) => NETWORKS[p.id]).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">{dict.network.hubLabel}</span>
          <select name="hub" defaultValue={hub} className="form-select">
            {hubs.map((code) => {
              const a = findAirport(code);
              return (
                <option key={code} value={code}>
                  {a ? `${cityName(a, locale)} (${code})` : code}
                </option>
              );
            })}
          </select>
        </label>
        <button
          type="submit"
          className="w-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 sm:w-auto print:hidden"
        >
          {dict.network.submit}
        </button>
      </form>

      <p className="mt-6 max-w-[62ch] text-sm text-muted" suppressHydrationWarning>
        {meta}
      </p>
      <ProgramReach programId={programId} programName={programName} />
      {fellBack && (
        <p className="mt-1 max-w-[62ch] text-xs text-muted">
          {interpolate(dict.network.hubFallback, {
            program: programName,
            asked: askedHub as string,
            hub: hubLabel,
          })}
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="self-start bg-surface-muted p-4 sm:p-6 lg:sticky lg:top-14">
          <NetworkPlot
            programId={programId}
            hub={hub}
            locale={locale}
            label={interpolate(dict.network.chartAria, {
              program: programName,
              hub: hubLabel,
              count: legs.length,
            })}
          />
        </div>

        <div className="space-y-6">
          {groups.map(({ region, legs: regionLegs }) => (
            <div key={region}>
              <h2 className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                <span>{dict.network[REGION_KEY[region]]}</span>
                <span className="tabular-nums">{regionLegs.length}</span>
              </h2>
              <ul>
                {regionLegs.map((leg) => (
                  <li key={leg.airport.code}>
                    <Link
                      href={`/search?origin=${hub}&destination=${leg.airport.code}&date=${date}&cabin=business`}
                      className="flex min-h-11 items-baseline justify-between gap-3 border-b border-border py-2 text-[13.5px] transition-colors hover:text-brand-text sm:min-h-0"
                    >
                      <span className="min-w-0 truncate">
                        <span className="font-medium text-foreground">{cityName(leg.airport, locale)}</span>{" "}
                        <span className="font-mono text-[11.5px] text-muted">{leg.airport.code}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-muted" suppressHydrationWarning>
                        {formatMiles(leg.km, locale)} km
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
