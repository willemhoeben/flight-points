/**
 * Purely decorative — no semantic content, so it's aria-hidden and never
 * intercepts clicks. A plain server component: the animation is CSS-only
 * (see .plane-flyover in globals.css), so it plays on its own the moment
 * this mounts, no client JS required.
 *
 * The silhouette is a planform (seen-from-below) airliner, which is how you
 * actually see a plane cross overhead: tapered fuselage, swept wings that
 * narrow toward the tip, tailplane, and two engine nacelles hung forward of
 * the wing leading edge. The two streaks behind the engines are contrails,
 * widening and fading as they fall behind.
 */
export function PlaneFlyover() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 flex items-center overflow-hidden print:hidden"
    >
      <svg className="plane-flyover w-[180px] text-foreground/70 sm:w-[255px]" viewBox="0 0 320 120" fill="none">
        <defs>
          <linearGradient id="fp-contrail" gradientUnits="userSpaceOnUse" x1="265" y1="0" x2="8" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M265 30.5 L8 26.5 L8 35.5 L265 33.5 Z" fill="url(#fp-contrail)" />
        <path d="M265 86.5 L8 84.5 L8 93.5 L265 89.5 Z" fill="url(#fp-contrail)" />

        <g fill="currentColor" className="plane-body">
          {/* fuselage: rounded nose at the right, tapering to the tail cone */}
          <path d="M315 60 C313 56.5 309 55 301 55 L235 55 C227 55 221 56.5 217 58 L217 62 C221 63.5 227 65 235 65 L301 65 C309 65 313 63.5 315 60 Z" />
          {/* main wings, swept back and tapered toward the tip */}
          <path d="M293 56 L259 12 L251 15 L269 56 Z" />
          <path d="M293 64 L259 108 L251 105 L269 64 Z" />
          {/* tailplane */}
          <path d="M231 57 L218 38 L212 40 L221 57 Z" />
          <path d="M231 63 L218 82 L212 80 L221 63 Z" />
          {/* engine nacelles, sitting forward of the wing leading edge */}
          <rect x="267" y="29" width="16" height="6" rx="3" />
          <rect x="267" y="85" width="16" height="6" rx="3" />
        </g>
      </svg>
    </div>
  );
}
