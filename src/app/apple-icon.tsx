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
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -5, color: "#ffffff" }}>FP</div>
      </div>
    ),
    { ...size },
  );
}
