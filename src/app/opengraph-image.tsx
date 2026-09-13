import { ImageResponse } from "next/og";
import { AIRPORTS } from "@/data/airports";
import { PROGRAMS } from "@/data/programs";
import { VALUATIONS } from "@/data/valuations";
import { SITE_NAME } from "@/lib/site";
import { BRAND_MARK_STAR, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const alt = `${SITE_NAME} — award search & points valuations`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {/* The wordmark, built the same way as BrandWordmark: a dotless i
            with the star standing in for its tittle. Satori has no
            select-none or sr-only to worry about — this is a picture. */}
        <div style={{ display: "flex", fontSize: 78, fontWeight: 700, color: "#1d1d1f", letterSpacing: -2 }}>
          <div style={{ display: "flex" }}>N</div>
          <div style={{ display: "flex", position: "relative" }}>
            <div style={{ display: "flex" }}>{"\u0131"}</div>
            <svg
              width={30}
              height={30}
              viewBox={BRAND_MARK_VIEWBOX}
              fill="#0071e3"
              style={{ position: "absolute", left: -5, top: 2 }}
            >
              <path d={BRAND_MARK_STAR} />
            </svg>
          </div>
          <div style={{ display: "flex" }}>ghtsky</div>
        </div>
        </div>

        <div style={{ display: "flex", marginTop: 26, fontSize: 32, color: "#6e6e73" }}>
          Award search + points valuations
        </div>

        <div style={{ display: "flex", gap: 64, marginTop: 60 }}>
          {[
            [String(PROGRAMS.length), "loyalty programs"],
            [String(AIRPORTS.length), "airports"],
            [String(VALUATIONS.length), "currencies"],
          ].map(([value, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#1d1d1f" }}>{value}</div>
              <div style={{ display: "flex", fontSize: 22, color: "#6e6e73", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
