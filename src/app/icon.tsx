import { ImageResponse } from "next/og";
import { BRAND_MARK_N, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffb547",
          }}
      >
        {/* The wordmark can't be a square, so every square slot carries the
            initial instead. At 16px in a browser tab a letter stays readable
            where a drawn mark would not. */}
        <svg width={32} height={32} viewBox={BRAND_MARK_VIEWBOX} fill="#130d02">
          <path d={BRAND_MARK_N} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
