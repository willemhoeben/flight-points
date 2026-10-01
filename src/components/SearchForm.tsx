import { AIRPORTS } from "@/data/airports";
import { CABINS } from "@/data/availability";
import { PASSENGER_OPTIONS } from "@/lib/passengers";
import { PROGRAMS } from "@/data/programs";
import { groupProgramsByAlliance } from "@/lib/program-groups";
import { interpolate } from "@/lib/i18n/format";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { cityName } from "@/lib/i18n/place-names";

export type SearchFormValues = {
  origin: string;
  destination: string;
  date: string;
  /** Empty string for a one-way trip. */
  returnDate: string;
  cabin: string;
  passengers: number;
  programs: string[];
};

/**
 * Plain GET form — submitting re-navigates to /search with query params,
 * so results are server-rendered and shareable via URL, no client JS needed.
 */
export function SearchForm({
  values,
  dict,
  cabins,
  locale,
}: {
  values: SearchFormValues;
  dict: Dictionary["searchForm"];
  cabins: Dictionary["cabins"];
  locale: Locale;
}) {
  // No ?programs= at all means "search everything", which is also what every
  // box being ticked means — so both read as "all" in the summary.
  const total = PROGRAMS.length;
  const selectedCount =
    values.programs.length === 0 ? total : values.programs.filter((id) => PROGRAMS.some((p) => p.id === id)).length;
  const isAllSelected = selectedCount === total;
  const programsSummary = isAllSelected
    ? interpolate(dict.programsAll, { count: total })
    : interpolate(dict.programsSome, { selected: selectedCount, total });

  return (
    <form method="get" action="/search" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={dict.from}>
          <select name="origin" defaultValue={values.origin} className="form-select">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {cityName(a, locale)} ({a.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label={dict.to}>
          <select name="destination" defaultValue={values.destination} className="form-select">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {cityName(a, locale)} ({a.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label={dict.depart}>
          <input type="date" name="date" defaultValue={values.date} className="form-select" />
        </Field>
        {/* Empty is a one-way trip, so this needs no "one way / return"
            switch of its own — the control and the answer are the same
            thing. min pins it to the departure, which is the only rule the
            picker can enforce; a hand-edited URL is caught on the page. */}
        <Field label={dict.returnDate} hint={dict.returnHint}>
          <input
            type="date"
            name="ret"
            min={values.date}
            defaultValue={values.returnDate}
            className="form-select"
          />
        </Field>
        <Field label={dict.cabin}>
          <select name="cabin" defaultValue={values.cabin} className="form-select">
            {CABINS.map((c) => (
              <option key={c.id} value={c.id}>
                {cabins[c.id]}
              </option>
            ))}
          </select>
        </Field>
        {/* Award space is per seat: a route can show four programs with one
            seat left each and be bookable for nobody travelling in a pair. */}
        <Field label={dict.passengers}>
          <select name="pax" defaultValue={String(values.passengers)} className="form-select">
            {PASSENGER_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Collapsed by default: every program is searched unless you say
          otherwise, so the picker only needs to be open when you're actually
          narrowing it. Left expanded on a narrowed search so the current
          selection stays visible. A native <details> keeps this JS-free, and
          collapsed checkboxes still submit with the form. */}
      <details className="group rounded-2xl bg-surface-muted" open={!isAllSelected}>
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5 text-muted transition-transform group-open:rotate-90"
          >
            <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {dict.programs}
          <span className="font-normal text-muted">{programsSummary}</span>
        </summary>
        <div className="space-y-4 px-4 pb-4">
          {groupProgramsByAlliance().map((group) => (
            <div key={group.alliance}>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                {group.alliance === "Unaligned" ? dict.allianceUnaligned : group.alliance}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                {group.programs.map((p) => (
                  <label
                    key={p.id}
                    /* The label is the tap target, not the 16px box.
                       Forty of these in a two-column grid at 20px a row
                       is a mis-tap every time; 44px on a phone fixes it
                       without changing the desktop grid. */
                    className="flex min-h-11 items-center gap-2 text-sm text-muted sm:min-h-0"
                  >
                    <input
                      type="checkbox"
                      name="programs"
                      value={p.id}
                      defaultChecked={values.programs.length === 0 || values.programs.includes(p.id)}
                      className="h-4 w-4 rounded border-border accent-[var(--brand)]"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>

      <button
        type="submit"
        className="w-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 sm:w-auto print:hidden"
      >
        {dict.submit}
      </button>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {/* Under the input, not beside the label: a German or French hint
          beside it wraps to a second line and pushes this one field's
          input below the baseline every other field sits on. */}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
