import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { runAgent } from "@/lib/ai/agent";

const schema = z.object({
  orgSlug: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { orgSlug, messages } = parsed.data;
  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, industry, agent_instructions, booking_instructions")
    .eq("slug", orgSlug)
    .single();

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  // Fetch FAQs
  const { data: faqs } = await supabase
    .from("faqs")
    .select("question, answer")
    .eq("organization_id", org.id);

  try {
    const reply = await runAgent(messages, {
      orgId: org.id,
      orgName: org.name,
      orgIndustry: org.industry,
      agentInstructions: org.agent_instructions,
      bookingInstructions: org.booking_instructions,
      faqs: faqs ?? [],
    });


    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI agent error:", err);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
