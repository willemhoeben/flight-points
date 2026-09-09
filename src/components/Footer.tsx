import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-semibold">Flight Points</div>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Search award availability and track what your points are really worth.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Product</div>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li><Link href="/search" className="hover:text-foreground">Award search</Link></li>
              <li><Link href="/valuations" className="hover:text-foreground">Points valuations</Link></li>
              <li><Link href="/deals" className="hover:text-foreground">Deals</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">About this project</div>
            <p className="mt-2 max-w-xs text-sm text-muted">
              A demo build inspired by seats.aero and flightpoints.com. All
              award availability and valuations shown are illustrative mock
              data, not a live feed, and this project is not affiliated with
              either site or any airline or loyalty program.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} Flight Points. Demo project — sample data only.
        </div>
      </div>
    </footer>
  );
}
