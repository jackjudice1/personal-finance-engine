import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

const bodySchema = z.object({
  type: z.enum(["can_i_afford_this", "debt_vs_investing", "what_if"]),
  inputs: z.record(z.string(), z.unknown()),
  outputs: z.record(z.string(), z.unknown()),
});

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
    return NextResponse.json({ error: "Invalid simulation payload" }, { status: 400 });
  }

  const { error } = await supabase.from("simulations").insert({
    user_id: user.id,
    type: parsed.data.type,
    inputs: parsed.data.inputs as Json,
    outputs: parsed.data.outputs as Json,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
