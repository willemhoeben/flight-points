import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import { findAirport } from "@/data/airports";
import { PROGRAMS } from "@/data/programs";
import { NETWORKS, hubsFor, type Region } from "@/data/networks";
import { byRegion, networkFrom, ringsFor } from "@/lib/network";
import { addDays, formatMiles, todayIso } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cityName } from "@/lib/i18n/place-names";
import { interpolate } from "@/lib/i18n/format";
import { alternateOgLocales, toOgLocale } from "@/lib/i18n/bcp47";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

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

type Rect = { x0: number; x1: number; y0: number; y1: number };

const hits = (a: Rect, b: Rect) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/**
 * Azimuthal equidistant plot centred on the hub: bearing is the angle,
 * distance is the radius. That is the one projection where a straight line
 * out of the middle really is the great circle the aircraft flies, and the
 * rings are true distances rather than decoration.
 */
function NetworkChart({
  programId,
  hub,
  locale,
  label,
}: {
  programId: string;
  hub: string;
  locale: Locale;
  label: string;
}) {
  const legs = networkFrom(programId, hub);
  const S = 600;
  const C = S / 2;
  const R = C - 34;
  // The plot is scaled to the longest route, not to the next round number
  // above it, so the network fills the circle instead of leaving a quarter of
  // the radius empty. The dashed rings stay round; the solid edge is the
  // furthest destination and carries its own distance.
  const furthest = legs.length ? legs[legs.length - 1].km : 2000;
  const rings = ringsFor(furthest).filter((km) => km < furthest * 0.97);

  const pt = (km: number, bearing: number): [number, number] => {
    const r = (km / furthest) * R;
    const a = (bearing * Math.PI) / 180;
    return [C + r * Math.sin(a), C - r * Math.cos(a)];
  };

  // Ring labels run down whichever of the two vertical spokes is emptier.
  // Pinned to due north they landed on top of the longest routes, which on
  // most hubs is exactly where the destinations are; the horizontal spokes
  // are no good either, because a label there runs into the compass letter.
  const SECTORS = [0, 180];
  const load = SECTORS.map(
    (deg) => legs.filter((l) => Math.abs(((l.bearing - deg + 540) % 360) - 180) < 45).length,
  );
  const labelSpoke = SECTORS[load.indexOf(Math.min(...load))];

  const taken: Rect[] = [];
  const ringLabels = [...rings, furthest].map((km) => {
    const [x, y] = pt(km, labelSpoke);
    const text = `${formatMiles(km, locale)} km`;
    taken.push({ x0: x - text.length * 3.6, x1: x + text.length * 3.6, y0: y - 4, y1: y + 14 });
    return { km, x, y: y + 8, text };
  });
  // The hub code sits above the centre dot and must not be written over.
  taken.push({ x0: C - 20, x1: C + 20, y0: C - 22, y1: C + 12 });

  // Every destination gets a line and a dot; only those whose code has room
  // get one. Transatlantic Europe piles onto one bearing at nearly the same
  // distance, and unfiltered the codes there collapse into an unreadable
  // blob. The list beside the chart names all of them regardless.
  const labelled = new Set<string>();
  for (const leg of [...legs].reverse()) {
    const [x, y] = pt(leg.km, leg.bearing);
    const end = leg.bearing > 180;
    // Padded past the glyph box: every label carries a 3-unit halo so it
    // stays readable over a route line, and the halo collides too.
    const w = leg.airport.code.length * 7 + 5;
    const box: Rect = {
      x0: end ? x - 5 - w : x + 5,
      x1: end ? x - 5 : x + 5 + w,
      y0: y - 7.5,
      y1: y + 7.5,
    };
    if (taken.some((t) => hits(t, box))) continue;
    taken.push(box);
    labelled.add(leg.airport.code);
  }

  return (
    <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label={label} className="mx-auto w-full max-w-[560px]">
      {rings.map((km) => (
        <circle
          key={`ring-${km}`}
          cx={C}
          cy={C}
          r={(km / furthest) * R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
      ))}
      <circle cx={C} cy={C} r={R} fill="none" stroke="var(--border)" strokeWidth={1.4} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const p = pt(furthest, deg);
        return (
          <line
            key={`spoke-${deg}`}
            x1={C}
            y1={C}
            x2={p[0].toFixed(1)}
            y2={p[1].toFixed(1)}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="2 7"
          />
        );
      })}
      {(
        [
          ["N", 0],
          ["E", 90],
          ["S", 180],
          ["W", 270],
        ] as const
      ).map(([name, deg]) => {
        const p = pt(furthest * 1.085, deg);
        return (
          <text
            key={name}
            x={p[0].toFixed(1)}
            y={(p[1] + 4).toFixed(1)}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize={11}
            fontFamily="var(--font-mono)"
          >
            {name}
          </text>
        );
      })}
      {[...legs].reverse().map((leg) => {
        const p = pt(leg.km, leg.bearing);
        return (
          <line
            key={`route-${leg.airport.code}`}
            x1={C}
            y1={C}
            x2={p[0].toFixed(1)}
            y2={p[1].toFixed(1)}
            stroke="var(--route)"
            strokeWidth={1}
            // 0.8, not the 0.4 this started at: a route line is a graphical
            // object that carries meaning, and at 0.4 it measured 1.75
            // against the daylight panel. At 0.8 it is 3.37 there and 6.59
            // on the night one, both past the 3:1 WCAG asks of a mark you
            // have to be able to see.
            strokeOpacity={0.8}
          />
        );
      })}
      {ringLabels.map((r) => (
        <text
          key={`ringlabel-${r.km}`}
          x={r.x.toFixed(1)}
          y={r.y.toFixed(1)}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize={11}
          fontFamily="var(--font-mono)"
          stroke="var(--surface-muted)"
          strokeWidth={3}
          paintOrder="stroke"
          suppressHydrationWarning
        >
          {r.text}
        </text>
      ))}
      {legs.map((leg) => {
        const p = pt(leg.km, leg.bearing);
        return (
          <circle
            key={`dot-${leg.airport.code}`}
            cx={p[0].toFixed(1)}
            cy={p[1].toFixed(1)}
            r={2.6}
            fill="var(--route)"
          />
        );
      })}
      {legs
        .filter((leg) => labelled.has(leg.airport.code))
        .map((leg) => {
          const p = pt(leg.km, leg.bearing);
          const end = leg.bearing > 180;
          return (
            <text
              key={`code-${leg.airport.code}`}
              x={(p[0] + (end ? -5 : 5)).toFixed(1)}
              y={(p[1] + 3.5).toFixed(1)}
              textAnchor={end ? "end" : "start"}
              fill="var(--foreground)"
              fontSize={11}
              fontFamily="var(--font-mono)"
              stroke="var(--surface-muted)"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {leg.airport.code}
            </text>
          );
        })}
      <circle cx={C} cy={C} r={5} fill="var(--stamp)" />
      <text
        x={C}
        y={C - 12}
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize={12}
        fontWeight={600}
        fontFamily="var(--font-mono)"
        stroke="var(--surface-muted)"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {hub}
      </text>
    </svg>
  );
}

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
          <NetworkChart
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
                      className="flex items-baseline justify-between gap-3 border-b border-border py-2 text-[13.5px] transition-colors hover:text-brand-text"
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
