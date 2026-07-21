import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingCompletePage() {
  return (
    <Card className="text-center">
      <CardHeader className="items-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <PartyPopper className="size-7" />
        </div>
        <CardTitle className="text-2xl">You&apos;re set up</CardTitle>
        <CardDescription>Your Financial Health Score and first recommendations are ready.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="lg" className="w-full" nativeButton={false} render={<Link href="/dashboard" />}>
          Go to my dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
