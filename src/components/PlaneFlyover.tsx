/**
 * Purely decorative — no semantic content, so it's aria-hidden and never
 * intercepts clicks. A plain server component: the animation is CSS-only
 * (see .plane-flyover in globals.css), so it plays on its own the moment
 * this mounts, no client JS required.
 */
export function PlaneFlyover() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1 h-10 overflow-hidden sm:top-3">
      <svg
        className="plane-flyover absolute left-0 top-0 h-6 w-6 text-brand sm:h-7 sm:w-7"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    </div>
  );
}
