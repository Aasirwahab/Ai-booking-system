"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ruleSchema = z.object({
  staff_id: z.string().uuid(),
  day_of_week: z.coerce.number().int().min(0).max(6),
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
  const parsed = ruleSchema.parse({
    staff_id: formData.get("staff_id"),
    day_of_week: formData.get("day_of_week"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
  });

  const supabase = createAdminClient();
  const { error } = await supabase.from("availability_rules").insert({
    organization_id: orgId,
    ...parsed,
  });
  if (error) throw new Error(error.message);
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
}
