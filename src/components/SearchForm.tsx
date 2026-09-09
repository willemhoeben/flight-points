import { AIRPORTS } from "@/data/airports";
import { CABINS } from "@/data/availability";
import { PROGRAMS } from "@/data/programs";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export type SearchFormValues = {
  origin: string;
  destination: string;
  date: string;
  cabin: string;
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
}: {
  values: SearchFormValues;
  dict: Dictionary["searchForm"];
  cabins: Dictionary["cabins"];
}) {
  return (
    <form method="get" action="/search" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={dict.from}>
          <select name="origin" defaultValue={values.origin} className="form-select">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label={dict.to}>
          <select name="destination" defaultValue={values.destination} className="form-select">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label={dict.depart}>
          <input type="date" name="date" defaultValue={values.date} className="form-select" />
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
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-foreground">{dict.programs}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {PROGRAMS.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm text-muted">
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

      <button
        type="submit"
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 sm:w-auto"
      >
        {dict.submit}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
