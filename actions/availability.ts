"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ruleSchema = z.object({
  staff_id: z.string().uuid(),
  days: z.array(z.coerce.number().int().min(0).max(6)).min(1),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function getAvailability() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("availability_rules")
    .select("*, staff:staff_profiles(full_name)")
    .eq("organization_id", orgId)
    .eq("is_active", true)
    .order("day_of_week")
    .order("start_time");
  return data ?? [];
}

export async function createAvailability(formData: FormData) {
  const orgId = await getOrgId();
  
  // Get all selected days
  const days = formData.getAll("days").map(Number);
  
  const parsed = ruleSchema.parse({
    staff_id: formData.get("staff_id"),
    days,
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
  });

  const supabase = createAdminClient();
  
  // Create an entry for each day
  const inserts = parsed.days.map(day => ({
    organization_id: orgId,
    staff_id: parsed.staff_id,
    day_of_week: day,
    start_time: parsed.start_time,
    end_time: parsed.end_time,
  }));

  const { error } = await supabase.from("availability_rules").insert(inserts);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/availability");
}

export async function deleteAvailability(id: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("availability_rules")
    .update({ is_active: false })
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/availability");
}
