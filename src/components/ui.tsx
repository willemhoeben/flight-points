import type { ReactNode } from "react";

const ACCENT_CLASSES: Record<string, string> = {
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
};

export function Badge({ accent = "sky", children }: { accent?: string; children: ReactNode }) {
  const cls = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.sky;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] bg-surface-muted ${className}`}>
      {children}
    </div>
  );
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
      {eyebrow && <div className="text-sm font-semibold text-brand">{eyebrow}</div>}
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-base text-muted">{description}</p>}
    </div>
  );
}
