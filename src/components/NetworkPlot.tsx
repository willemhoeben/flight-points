import { networkFrom, ringsFor } from "@/lib/network";
import { formatMiles } from "@/lib/format";
import type { Locale } from "@/lib/i18n/locales";

type Rect = { x0: number; x1: number; y0: number; y1: number };

/** How long the whole network takes to draw, however many legs it has. */
const ROUTE_DRAW_MS = 900;

const hits = (a: Rect, b: Rect) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/**
 * Azimuthal equidistant plot centred on the hub: bearing is the angle,
 * distance is the radius. That is the one projection where a straight line
 * out of the middle really is the great circle the aircraft flies, and the
 * rings are true distances rather than decoration.
 */
export function NetworkPlot({
  programId,
  hub,
  locale,
  label,
  compact = false,
  className = "mx-auto w-full max-w-[560px]",
}: {
  programId: string;
  hub: string;
  locale: Locale;
  label: string;
  /**
   * Drops the destination codes, the ring distances and the compass letters,
   * keeping the rings, the routes and the hub. At the size this runs beside
   * a headline none of that text is legible anyway, and a plot full of
   * unreadable three-letter codes reads as noise rather than as a drawing.
   * The shape is the point there; the page it links to carries the detail.
   */
  compact?: boolean;
  className?: string;
}) {
  const legs = networkFrom(programId, hub);
  const S = 600;
  const C = S / 2;
  const R = C - 34;
  // The plot is scaled to the longest route, not to the next round number
  // above it, so the network fills the circle instead of leaving a quarter of
  // the radius empty. The dashed rings stay round; the solid edge is the
  // furthest destination and carries its own distance.
  const furthest = legs.length ? legs[legs.length - 1].km : 2000;
  const rings = ringsFor(furthest);

  const pt = (km: number, bearing: number): [number, number] => {
    const r = (km / furthest) * R;
    const a = (bearing * Math.PI) / 180;
    return [C + r * Math.sin(a), C - r * Math.cos(a)];
  };

  // Ring labels run down whichever of the two vertical spokes is emptier.
  // Pinned to due north they landed on top of the longest routes, which on
  // most hubs is exactly where the destinations are; the horizontal spokes
  // are no good either, because a label there runs into the compass letter.
  const SECTORS = [0, 180];
  const load = SECTORS.map(
    (deg) => legs.filter((l) => Math.abs(((l.bearing - deg + 540) % 360) - 180) < 45).length,
  );
  const labelSpoke = SECTORS[load.indexOf(Math.min(...load))];

  const taken: Rect[] = [];
  // The outer label first, then the rings inward, each one dropped if it
  // would sit on a label already placed. A ratio gap does not work here: the
  // rings are round numbers and the edge is wherever the longest route
  // happens to end, so on a hub whose furthest destination is 15,474 km the
  // 15,000 km ring lands ten kilometres inside it and the two labels print
  // on top of each other. Measuring the boxes is the only thing that knows.
  const ringLabels: { km: number; x: number; y: number; text: string }[] = [];
  for (const km of [furthest, ...[...rings].reverse()]) {
    const [x, y] = pt(km, labelSpoke);
    const text = `${formatMiles(km, locale)} km`;
    const box: Rect = { x0: x - text.length * 3.6, x1: x + text.length * 3.6, y0: y - 4, y1: y + 14 };
    if (taken.some((t) => hits(t, box))) continue;
    taken.push(box);
    ringLabels.push({ km, x, y: y + 8, text });
  }
  // The hub code sits above the centre dot and must not be written over.
  taken.push({ x0: C - 20, x1: C + 20, y0: C - 22, y1: C + 12 });

  // Every destination gets a line and a dot; only those whose code has room
  // get one. Transatlantic Europe piles onto one bearing at nearly the same
  // distance, and unfiltered the codes there collapse into an unreadable
  // blob. The list beside the chart names all of them regardless.
  const labelled = new Set<string>();
  for (const leg of compact ? [] : [...legs].reverse()) {
    const [x, y] = pt(leg.km, leg.bearing);
    const end = leg.bearing > 180;
    // Padded past the glyph box: every label carries a 3-unit halo so it
    // stays readable over a route line, and the halo collides too.
    const w = leg.airport.code.length * 7 + 5;
    const box: Rect = {
      x0: end ? x - 5 - w : x + 5,
      x1: end ? x - 5 : x + 5 + w,
      y0: y - 7.5,
      y1: y + 7.5,
    };
    if (taken.some((t) => hits(t, box))) continue;
    taken.push(box);
    labelled.add(leg.airport.code);
  }

  return (
    <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label={label} className={className}>
      {rings.map((km) => (
        <circle
          key={`ring-${km}`}
          cx={C}
          cy={C}
          r={(km / furthest) * R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
      ))}
      <circle cx={C} cy={C} r={R} fill="none" stroke="var(--border)" strokeWidth={1.4} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const p = pt(furthest, deg);
        return (
          <line
            key={`spoke-${deg}`}
            x1={C}
            y1={C}
            x2={p[0].toFixed(1)}
            y2={p[1].toFixed(1)}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="2 7"
          />
        );
      })}
      {(compact
        ? []
        : ([
          ["N", 0],
          ["E", 90],
          ["S", 180],
          ["W", 270],
          ] as const)
      ).map(([name, deg]) => {
        const p = pt(furthest * 1.085, deg);
        return (
          <text
            key={name}
            x={p[0].toFixed(1)}
            y={(p[1] + 4).toFixed(1)}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize={11}
            fontFamily="var(--font-mono)"
          >
            {name}
          </text>
        );
      })}
      {/* The routes draw outward from the hub, nearest first, as if the
          network were being flown rather than printed. pathLength={1}
          normalises every line to the same unit regardless of its real
          length, so one dash rule covers all of them and a 900km hop takes
          the same time to draw as a 12,000km one — which is what makes it
          read as a single sweep instead of a race.

          The stagger is capped: at 104 destinations a per-leg delay of 12ms
          would run for a second and a quarter, so it compresses to fit
          ROUTE_DRAW_MS however many legs there are. CSS only, no script,
          and `prefers-reduced-motion` drops it to the finished state. */}
      {[...legs].reverse().map((leg, i) => {
        const p = pt(leg.km, leg.bearing);
        const step = legs.length > 1 ? ROUTE_DRAW_MS / legs.length : 0;
        return (
          <line
            key={`route-${leg.airport.code}`}
            className="route-draw"
            style={{ animationDelay: `${Math.round((legs.length - 1 - i) * step)}ms` }}
            pathLength={1}
            x1={C}
            y1={C}
            x2={p[0].toFixed(1)}
            y2={p[1].toFixed(1)}
            stroke="var(--route)"
            strokeWidth={1}
            // 0.8, not the 0.4 this started at: a route line is a graphical
            // object that carries meaning, and at 0.4 it measured 1.75
            // against the daylight panel. At 0.8 it is 3.37 there and 6.59
            // on the night one, both past the 3:1 WCAG asks of a mark you
            // have to be able to see.
            strokeOpacity={0.8}
          />
        );
      })}
      {(compact ? [] : ringLabels).map((r) => (
        <text
          key={`ringlabel-${r.km}`}
          x={r.x.toFixed(1)}
          y={r.y.toFixed(1)}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize={11}
          fontFamily="var(--font-mono)"
          stroke={compact ? "var(--background)" : "var(--surface-muted)"}
          strokeWidth={3}
          paintOrder="stroke"
          suppressHydrationWarning
        >
          {r.text}
        </text>
      ))}
      {legs.map((leg, i) => {
        const p = pt(leg.km, leg.bearing);
        const step = legs.length > 1 ? ROUTE_DRAW_MS / legs.length : 0;
        return (
          <circle
            key={`dot-${leg.airport.code}`}
            className="route-dot"
            // Arrives just after its own line does, so a destination lights
            // up when the route reaches it.
            style={{ animationDelay: `${Math.round(i * step + 260)}ms` }}
            cx={p[0].toFixed(1)}
            cy={p[1].toFixed(1)}
            r={2.6}
            fill="var(--route)"
          />
        );
      })}
      {legs
        .filter((leg) => labelled.has(leg.airport.code))
        .map((leg) => {
          const p = pt(leg.km, leg.bearing);
          const end = leg.bearing > 180;
          return (
            <text
              key={`code-${leg.airport.code}`}
              x={(p[0] + (end ? -5 : 5)).toFixed(1)}
              y={(p[1] + 3.5).toFixed(1)}
              textAnchor={end ? "end" : "start"}
              fill="var(--foreground)"
              fontSize={11}
              fontFamily="var(--font-mono)"
              stroke={compact ? "var(--background)" : "var(--surface-muted)"}
              strokeWidth={3}
              paintOrder="stroke"
            >
              {leg.airport.code}
            </text>
          );
        })}
      <circle cx={C} cy={C} r={5} fill="var(--stamp)" />
      {!compact && (
      <text
        x={C}
        y={C - 12}
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize={12}
        fontWeight={600}
        fontFamily="var(--font-mono)"
        stroke={compact ? "var(--background)" : "var(--surface-muted)"}
        strokeWidth={3}
        paintOrder="stroke"
      >
        {hub}
      </text>
      )}
    </svg>
  );
}
