import Link from "next/link";
import { formatDateLabel } from "@/lib/format";
import type { Locale } from "@/lib/i18n/locales";
import type { Leg } from "@/lib/trip";

function href(baseParams: URLSearchParams, departure: string, returnDate: string, leg: Leg): string {
  const params = new URLSearchParams(baseParams);
  params.set("date", departure);
  params.set("ret", returnDate);
  if (leg === "return") params.set("leg", "return");
  return `/search?${params.toString()}`;
}

/**
 * Which half of a round trip the calendar and the results table are
 * showing.
 *
 * Two tables stacked would mean two filter rows, two sorts and two empty
 * states for one trip; one table and a switch keeps every control meaning
 * exactly one thing. Plain links, so the choice stays in the URL and the
 * page stays server-rendered like the rest of the search.
 */
export function LegSwitch({
  leg,
  baseParams,
  departure,
  returnDate,
  labels,
  locale,
}: {
  leg: Leg;
  baseParams: URLSearchParams;
  departure: string;
  returnDate: string;
  labels: { group: string; outbound: string; back: string };
  locale: Locale;
}) {
  const options: { key: Leg; label: string; date: string }[] = [
    { key: "outbound", label: labels.outbound, date: departure },
    { key: "return", label: labels.back, date: returnDate },
  ];

  return (
    <nav aria-label={labels.group} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.key === leg;
        return (
          <Link
            key={option.key}
            href={href(baseParams, departure, returnDate, option.key)}
            aria-current={active ? "page" : undefined}
            className={[
              "flex min-h-11 flex-col justify-center px-4 py-1.5 text-sm transition-colors",
              active
                ? "bg-brand text-brand-foreground font-semibold"
                : "border border-border-strong text-muted hover:text-foreground",
            ].join(" ")}
          >
            <span>{option.label}</span>
            <span className="font-mono text-xs font-normal tabular-nums" suppressHydrationWarning>
              {formatDateLabel(option.date, locale)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
