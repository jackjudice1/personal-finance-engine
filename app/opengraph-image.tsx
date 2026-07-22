import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public/favicon-square.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          <img src={logoSrc} width={64} height={64} style={{ borderRadius: 14 }} alt="" />
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
