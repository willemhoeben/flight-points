import Link from "next/link";
import { findAirport } from "@/data/airports";
import { formatMiles } from "@/lib/format";
import { interpolate } from "@/lib/i18n/format";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

export type NearbyOption = {
  origin: string;
  destination: string;
  km: number;
  /** Cheapest award on this route for the same day, or null for nothing released. */
  milesCost: number | null;
  /** How much less than the route the visitor is already looking at. */
  savedMiles: number;
  /** The end that was swapped, which is the one worth naming. */
  swappedCode: string;
  /** The airport the swap replaces, so the line says what it is next to. */
  replacesCode: string;
  /**
   * Built by the page rather than here: on the return leg the pair above
   * reads in reversed terms, and only the page knows which way round the
   * trip's own origin and destination go.
   */
  href: string;
};

/**
 * The gateways next door, priced on the same day.
 *
 * Award space is released per airport, not per city, so a New Yorker who
 * only ever searches JFK never sees what Newark and LaGuardia let go that
 * morning. Routes with nothing released stay on the list rather than
 * disappearing from it: "Newark has nothing" is an answer, and a list that
 * quietly drops what it checked cannot be trusted to have checked it.
 */
export function NearbyAirports({
  options,
  dict,
  locale,
}: {
  options: NearbyOption[];
  dict: Dictionary["search"];
  locale: Locale;
}) {
  if (options.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold text-foreground">{dict.nearbyHeading}</h2>
      <p className="mt-1 max-w-[62ch] text-sm text-muted">{dict.nearbySub}</p>
      <ul className="mt-4 grid gap-px bg-border-strong sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          // Naming the swapped end rather than the city pair: on an origin
          // swap both routes read "New York → London", which says nothing
          // about which airport you would actually be driving to.
          const swapped = findAirport(option.swappedCode);
          return (
            <li key={`${option.origin}-${option.destination}`} className="bg-background">
              <Link
                href={option.href}
                className="flex min-h-11 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 py-3 transition-colors hover:bg-surface-muted"
              >
                <span className="text-sm text-foreground">
                  <span className="font-mono">{option.origin}</span>
                  {" → "}
                  <span className="font-mono">{option.destination}</span>
                  <span className="ml-2 text-xs text-muted">
                    {swapped
                      ? interpolate(dict.nearbySwap, {
                          name: swapped.name,
                          km: String(option.km),
                          code: option.replacesCode,
                        })
                      : option.swappedCode}
                  </span>
                </span>
                {option.milesCost === null ? (
                  <span className="text-xs text-muted">{dict.nearbyNone}</span>
                ) : (
                  <span className="text-right">
                    <span
                      className="font-mono text-sm font-semibold tabular-nums text-foreground"
                      suppressHydrationWarning
                    >
                      {formatMiles(option.milesCost, locale)}
                    </span>
                    {option.savedMiles > 0 && (
                      <span className="ml-2 text-xs font-medium text-success-text" suppressHydrationWarning>
                        {interpolate(dict.nearbyCheaper, { miles: formatMiles(option.savedMiles, locale) })}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
