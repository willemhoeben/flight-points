import type { ReactNode } from "react";
import type { Accent } from "@/lib/accent";

/**
 * One measured ink-on-tint pair per accent, defined in globals.css for both
 * themes. Previously these were Tailwind palette steps over a 10%-alpha
 * tint, which left the effective background dependent on whatever surface
 * the badge happened to land on — and three of them dropped under AA on the
 * mobile card layout, where that surface differs from the table.
 */
const ACCENT_CLASSES: Record<Accent, string> = {
  sky: "bg-tint-sky text-ink-sky",
  indigo: "bg-tint-indigo text-ink-indigo",
  violet: "bg-tint-violet text-ink-violet",
  fuchsia: "bg-tint-fuchsia text-ink-fuchsia",
  amber: "bg-tint-amber text-ink-amber",
  rose: "bg-tint-rose text-ink-rose",
  emerald: "bg-tint-emerald text-ink-emerald",
  cyan: "bg-tint-cyan text-ink-cyan",
};


export function Badge({ accent = "sky", children }: { accent?: Accent; children: ReactNode }) {
  const cls = ACCENT_CLASSES[accent];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

/**
 * The one pill. Sorting on the search and valuations cards, the alliance and
 * fees filters, the type filter, the saved-only toggle: all of them were the
 * same two class strings copied into five files, which is how four of them
 * ended up 28px tall on a phone while the fifth was fixed.
 *
 * 44px is the floor a fingertip needs, and it applies on a phone only. A
 * cursor hits 28px fine, and the compact row is the intended look once there
 * is a pointer — so the height goes up where the hand is, not everywhere.
 *
 * `semantics` is not decoration. `choice` is one of a group, so it announces
 * as current; `toggle` is independently on or off, so it announces as
 * pressed. Picking the wrong one tells a screen-reader user that a sort
 * column is "pressed", or says nothing at all about a filter being on.
 */
export const PILL_SHELL =
  "inline-flex min-h-11 items-center gap-1 px-3.5 text-xs sm:min-h-0 sm:py-1.5";

/**
 * The chromeless selects in the header and the phone panel: theme, language,
 * currency. Borderless on purpose — they read as part of the bar rather than
 * as three boxes — which is also why they measured 24px tall until the floor
 * landed here. Same phone-only rule as the pills.
 */
export const BARE_SELECT =
  "min-h-11 cursor-pointer border-0 bg-transparent py-1 pl-0 pr-1 text-xs font-medium text-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:min-h-0";

export function Pill({
  selected,
  semantics,
  onClick,
  children,
}: {
  selected: boolean;
  semantics: "choice" | "toggle";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={semantics === "toggle" ? selected : undefined}
      aria-current={semantics === "choice" && selected ? "true" : undefined}
      className={`${PILL_SHELL} ${
        selected
          ? "bg-brand font-semibold text-brand-foreground"
          : "bg-surface-muted font-medium text-muted transition-colors hover:text-foreground"
      }`}
    >
      {children}
    </button>
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
  // A filled card is an object and takes the light; a ruled one is a
  // division of the page and takes none.
  const base = variant === "filled" ? "panel bg-surface-muted" : "border-t border-border-strong";
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
      <h1 className="display mt-2 text-[34px] text-foreground sm:text-[42px]">{title}</h1>
      {/* Capped by characters, not by the heading block: max-w-2xl runs an
          intro out past eighty characters a line. */}
      {description && <p className="mt-3 max-w-[62ch] text-base text-muted">{description}</p>}
    </div>
  );
}
