import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0f1b3d",
          backgroundImage: "radial-gradient(circle at 85% 20%, rgba(47,191,143,0.25), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#10203f",
              border: "1px solid rgba(255,255,255,0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
              <path
                d="M17 5.5C11 5.5 8 7.5 8 10.5C8 13 11 13.5 12 13.5C13 13.5 16 14 16 16.5C16 19.5 13 20.5 7 20.5"
                stroke="#ffffff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M13 18 L19 12 M19 16 V12 H15" stroke="#2fbf8f" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, color: "#f4f7f5", fontWeight: 600, lineHeight: 1 }}>Summora</div>
            <div style={{ fontSize: 16, color: "#2fbf8f", fontWeight: 600, letterSpacing: 4 }}>SYSTEMS</div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#f4f7f5", lineHeight: 1.15, maxWidth: 900 }}>
          Your money. Your goals. Your next best decision.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9ba3b8", marginTop: 28, maxWidth: 820 }}>
          Personalized recommendations to save smarter, invest better, and build wealth faster.
        </div>
      </div>
    ),
    size
  );
}
