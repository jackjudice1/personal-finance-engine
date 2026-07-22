import type { SVGProps } from "react";

/** A stylized "S" with an upward trend arrow emerging from it — the Summora mark. Inherits color via currentColor, same convention as lucide-react icons, so it drops into the existing "colored badge" logo treatment everywhere. */
export function SummoraLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 5.5C11 5.5 8 7.5 8 10.5C8 13 11 13.5 12 13.5C13 13.5 16 14 16 16.5C16 19.5 13 20.5 7 20.5" />
      <path d="M13 18 L19 12 M19 16 V12 H15" />
    </svg>
  );
}
