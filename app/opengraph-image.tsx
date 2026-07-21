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
          background: "#0e1512",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(56,202,160,0.25), transparent 60%)",
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
              background: "#38caa0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0a1512" strokeWidth="2.5">
              <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontSize: 32, color: "#f4f7f5", fontWeight: 600 }}>Decision Engine</div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#f4f7f5", lineHeight: 1.15, maxWidth: 900 }}>
          Your money. Your goals. Your next best decision.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9ba39d", marginTop: 28, maxWidth: 820 }}>
          Personalized recommendations to save smarter, invest better, and build wealth faster.
        </div>
      </div>
    ),
    size
  );
}
