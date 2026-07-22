import Link from "next/link";
import { SummoraLogo } from "@/components/shared/SummoraLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grid-fade bg-background px-4 py-12">
      <Link href="/" className="mb-8 flex items-center">
        <SummoraLogo className="h-8 w-auto" />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
