import type { SVGProps } from "react";

/** Mountain peaks with an upward trend arrow — the Summit mark. Inherits color via currentColor, same convention as lucide-react icons, so it drops into the existing "colored badge" logo treatment everywhere. */
export function SummitLogo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M2 19 L7 12 L10 15 L14 8 L19 3" />
      <path d="M13 3 L19 3 L19 9" />
    </svg>
  );
}
