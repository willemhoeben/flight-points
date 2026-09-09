import { AIRPORTS } from "@/data/airports";
import { CABINS } from "@/data/availability";
import { PROGRAMS } from "@/data/programs";

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
export function SearchForm({ values }: { values: SearchFormValues }) {
  return (
    <form method="get" action="/search" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="From">
          <select name="origin" defaultValue={values.origin} className="form-select">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label="To">
          <select name="destination" defaultValue={values.destination} className="form-select">
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Depart">
          <input type="date" name="date" defaultValue={values.date} className="form-select" />
        </Field>
        <Field label="Cabin">
          <select name="cabin" defaultValue={values.cabin} className="form-select">
            {CABINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-foreground">Programs</div>
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
        Search award flights
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
