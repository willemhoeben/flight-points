import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 text-[12.5px] sm:grid-cols-3">
          <div>
            <div className="font-semibold text-foreground">Flight Points</div>
            <p className="mt-2 max-w-xs text-muted">
              Search award availability and track what your points are really worth.
            </p>
          </div>
          <div>
            <div className="font-semibold text-foreground">Product</div>
            <ul className="mt-2 space-y-1.5 text-muted">
              <li><Link href="/search" className="hover:text-foreground">Award search</Link></li>
              <li><Link href="/valuations" className="hover:text-foreground">Points valuations</Link></li>
              <li><Link href="/deals" className="hover:text-foreground">Deals</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-foreground">About this project</div>
            <p className="mt-2 max-w-xs text-muted">
              A demo build inspired by seats.aero and flightpoints.com. All
              award availability and valuations shown are illustrative mock
              data, not a live feed, and this project is not affiliated with
              either site or any airline or loyalty program.
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-[11.5px] text-muted">
          © {new Date().getFullYear()} Flight Points. Demo project — sample data only.
        </div>
      </div>
    </footer>
  );
}
