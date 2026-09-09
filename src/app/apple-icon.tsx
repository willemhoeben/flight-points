import { ImageResponse } from "next/og";

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
        <svg width="108" height="108" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 16.5l7-2.2V6.4a1.6 1.6 0 013.2 0v7.6l7 2.5v1.8l-7-1.4v3.5l2 1.3v1.3l-3.6-.9-3.6.9v-1.3l2-1.3v-3.5l-7 1.4v-1.9z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
