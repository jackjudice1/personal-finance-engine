import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { buildFinancialProfile } from "@/lib/engine/buildProfile";
import { answerQuestion } from "@/lib/ai/assistant";

const bodySchema = z.object({ question: z.string().min(1).max(500) });

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Ask me an actual question." }, { status: 400 });
  }

  const [incomeRes, expensesRes, assetsRes, liabilitiesRes, goalsRes] = await Promise.all([
    supabase.from("income_sources").select("*").eq("user_id", user.id),
    supabase.from("expenses").select("*").eq("user_id", user.id),
    supabase.from("assets").select("*").eq("user_id", user.id),
    supabase.from("liabilities").select("*").eq("user_id", user.id),
    supabase.from("goals").select("*").eq("user_id", user.id).eq("status", "active"),
  ]);

  const profile = buildFinancialProfile({
    userId: user.id,
    incomeSources: incomeRes.data ?? [],
    expenses: expensesRes.data ?? [],
    assets: assetsRes.data ?? [],
    liabilities: liabilitiesRes.data ?? [],
    goals: goalsRes.data ?? [],
  });

  const answer = answerQuestion(parsed.data.question, profile);

  return NextResponse.json({ answer });
}
