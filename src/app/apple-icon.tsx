import { ImageResponse } from "next/og";
import { BRAND_MARK_N, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

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
        {/* iOS rounds and crops the corners itself, so the letter sits well
            inside the square rather than filling it. */}
        <svg width={136} height={136} viewBox={BRAND_MARK_VIEWBOX} fill="#ffffff">
          <path d={BRAND_MARK_N} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
