import type { ReactNode } from "react";

/**
 * One measured ink-on-tint pair per accent, defined in globals.css for both
 * themes. Previously these were Tailwind palette steps over a 10%-alpha
 * tint, which left the effective background dependent on whatever surface
 * the badge happened to land on — and three of them dropped under AA on the
 * mobile card layout, where that surface differs from the table.
 */
const ACCENT_CLASSES: Record<string, string> = {
  sky: "bg-tint-sky text-ink-sky",
  indigo: "bg-tint-indigo text-ink-indigo",
  violet: "bg-tint-violet text-ink-violet",
  fuchsia: "bg-tint-fuchsia text-ink-fuchsia",
  amber: "bg-tint-amber text-ink-amber",
  rose: "bg-tint-rose text-ink-rose",
  emerald: "bg-tint-emerald text-ink-emerald",
  cyan: "bg-tint-cyan text-ink-cyan",
};


export function Badge({ accent = "sky", children }: { accent?: string; children: ReactNode }) {
  const cls = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.sky;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

/**
 * `ruled` (the default) is a column under a hairline, which is what most of
 * these are: one of a set read across, not an object to pick up. `filled`
 * is for a panel that really is a separate thing on the page — the points
 * calculator sitting beside a table, say.
 */
export function Card({
  children,
  className = "",
  variant = "ruled",
}: {
  children: ReactNode;
  className?: string;
  variant?: "ruled" | "filled";
}) {
  const base = variant === "filled" ? "bg-surface-muted" : "border-t border-border-strong";
  return <div className={`${base} ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <div className="text-sm font-semibold text-brand-text">{eyebrow}</div>}
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-base text-muted">{description}</p>}
    </div>
  );
}
