"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";

export async function getAgentConfig() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("organizations")
    .select("agent_instructions, agent_enabled, name, industry, widget_color, welcome_message, booking_instructions, ai_tone, slot_duration")
    .eq("id", orgId)
    .single();
  return data;
}

export async function updateAgentConfig(formData: FormData) {
  const orgId = await getOrgId();
  const instructions = formData.get("agent_instructions") as string;
  const enabled = formData.get("agent_enabled") === "on" || formData.get("agent_enabled") === "true";
  const widget_color = formData.get("widget_color") as string;
  const welcome_message = formData.get("welcome_message") as string;
  const booking_instructions = formData.get("booking_instructions") as string;
  const ai_tone = formData.get("ai_tone") as string;
  const slot_duration = parseInt(formData.get("slot_duration") as string || "30");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("organizations")
    .update({
      agent_instructions: instructions,
      agent_enabled: enabled,
      widget_color,
      welcome_message,
      booking_instructions,
      ai_tone,
      slot_duration,
    })
    .eq("id", orgId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ai-agent");
}
