import { ImageResponse } from "next/og";
import { BRAND_MARK_STAR, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0071e3",
        }}
      >
        {/* iOS rounds and crops the corners itself. The star's four points
            aim at the middle of each edge rather than into a corner, so a
            modest inset is enough to stay clear of the mask. */}
        <svg width={132} height={132} viewBox={BRAND_MARK_VIEWBOX} fill="#ffffff">
          <path d={BRAND_MARK_STAR} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
