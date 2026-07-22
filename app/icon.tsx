import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10203f",
          borderRadius: 7,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
          <path
            d="M17 5.5C11 5.5 8 7.5 8 10.5C8 13 11 13.5 12 13.5C13 13.5 16 14 16 16.5C16 19.5 13 20.5 7 20.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M13 18 L19 12 M19 16 V12 H15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size
  );
}
