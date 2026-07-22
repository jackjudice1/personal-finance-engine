import Link from "next/link";
import { SummoraLogo } from "@/components/shared/SummoraLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grid-fade bg-background px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <SummoraLogo className="size-4.5" />
        </span>
        Summora
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
