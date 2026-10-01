import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items, ariaLabel }: { items: BreadcrumbItem[]; ariaLabel: string }) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-border">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center font-medium text-brand-text hover:underline sm:min-h-0"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
