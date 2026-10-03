import { mulberry32, seedFromString } from "@/lib/prng";

/**
 * The site is called Nightsky and there was no sky.
 *
 * Everything sat on one flat navy fill, which is what made the whole thing
 * read as a dark dashboard rather than as a thing with a name. This is the
 * ground: a real field of stars behind the page, visible only through the
 * page background, never through a panel or a table.
 *
 * Not random dots. Random dots look like a CSS demo — evenly spattered,
 * all the same size, no structure. A real sky has three properties, and
 * having all three is the difference between "stars" and "noise":
 *
 *  1. Magnitude follows a power law. There are a handful of bright stars
 *     and thousands of faint ones, so the radii here are drawn from
 *     `u^2.2`, which puts most of the field near the floor and lets a few
 *     carry real size and glow.
 *  2. The sky is not uniform. The galactic plane is a dense band across
 *     it, so two thirds of these are drawn clustered on a great circle
 *     tilted across the viewport, with a Gaussian falloff either side.
 *  3. Stars are not white. They run from warm orange through white to
 *     blue-white by temperature, and the colour correlates with size.
 *
 * Deterministic from a fixed seed, so the server and the client draw the
 * identical sky and hydration has nothing to argue about. No script, no
 * canvas, no animation loop: one inline SVG that costs nothing to paint and
 * works with JavaScript off.
 */

const STAR_COUNT = 260;
/** Two thirds along the galactic band, the rest scattered. */
const BAND_SHARE = 0.66;
/** Degrees. The band crosses the viewport corner to corner, roughly. */
const BAND_TILT = -22;
/** How tightly the band hugs its great circle, as a share of the height. */
const BAND_SPREAD = 0.12;

/** Stellar colours by temperature, coolest first. */
const STAR_COLORS = ["#ffd2a1", "#ffe9d2", "#ffffff", "#e6eeff", "#cddcff"];

type Star = { x: number; y: number; r: number; o: number; c: string };

/**
 * A box–Muller normal, so the band has a real falloff instead of a hard
 * edge. Clamped, because a three-sigma tail would throw occasional stars
 * far enough to read as a mistake rather than as scatter.
 */
function normal(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(-2.5, Math.min(2.5, n));
}

function buildStars(): Star[] {
  const rand = mulberry32(seedFromString("nightsky-ground-v1"));
  const slope = Math.tan((BAND_TILT * Math.PI) / 180);
  const stars: Star[] = [];

  for (let i = 0; i < STAR_COUNT; i++) {
    const x = rand();
    const inBand = rand() < BAND_SHARE;
    // The band runs through the middle of the viewport at BAND_TILT.
    const y = inBand
      ? 0.5 + slope * (x - 0.5) + normal(rand) * BAND_SPREAD
      : rand();
    if (y < -0.02 || y > 1.02) continue;

    // u^2.6 — most stars at the floor, a few genuinely bright. The first
    // pass used 2.2 with radii up to 1.85, and at the size the viewBox is
    // scaled to on a laptop those top stars rendered as soft grey discs:
    // lens dust, not sky. A real star is a point of light; the brightest
    // one here is now 1.1 units, about a pixel and a half on screen.
    const mag = Math.pow(rand(), 2.6);
    const r = 0.28 + mag * 0.82;
    // Brightness tracks size, as it does in the sky, with a little scatter
    // so the field does not look like one gradient.
    const o = 0.16 + mag * 0.6 + rand() * 0.12;
    // Bigger stars skew blue-white, which is how the real colour-magnitude
    // relation runs for the ones you can actually see.
    const ci = Math.min(STAR_COLORS.length - 1, Math.floor(mag * 4 + rand() * 1.4));

    stars.push({
      x: Math.round(x * 10000) / 10000,
      y: Math.round(y * 10000) / 10000,
      r: Math.round(r * 100) / 100,
      o: Math.round(Math.min(0.95, o) * 100) / 100,
      c: STAR_COLORS[ci],
    });
  }
  return stars;
}

const STARS = buildStars();
/** The few bright enough to earn a halo, and it is a small, cool one. */
const BRIGHT = STARS.filter((s) => s.r > 0.95);

export function NightSky() {
  return (
    <div className="night-sky" aria-hidden="true">
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {/* The band as light, not as a shape. The first pass drew it as a
              gradient-filled rect: the ends faded but the long edges did
              not, so a hard diagonal line ran across the whole page and
              read as a banner. A radial fill on a stretched ellipse has no
              straight edge anywhere. */}
          <radialGradient id="ns-band">
            <stop offset="0%" stopColor="#223160" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#1b2749" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#141d38" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ns-glow">
            <stop offset="0%" stopColor="#cddcff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#cddcff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform="rotate(-22 500 500)">
          <ellipse cx="500" cy="500" rx="900" ry="135" fill="url(#ns-band)" />
        </g>

        {BRIGHT.map((s, i) => (
          <circle
            key={`g${i}`}
            cx={s.x * 1000}
            cy={s.y * 1000}
            r={s.r * 5}
            fill="url(#ns-glow)"
            opacity={s.o * 0.55}
          />
        ))}

        {STARS.map((s, i) => (
          <circle key={i} cx={s.x * 1000} cy={s.y * 1000} r={s.r} fill={s.c} opacity={s.o} />
        ))}
      </svg>
    </div>
  );
}
