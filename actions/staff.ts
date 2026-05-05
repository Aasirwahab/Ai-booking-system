"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";

const staffSchema = z.object({
  full_name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  role_title: z.string().optional(),
});

export async function getStaff() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("organization_id", orgId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createStaff(formData: FormData) {
  const orgId = await getOrgId();
  const parsed = staffSchema.parse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role_title: formData.get("role_title"),
  });

  const supabase = createAdminClient();
  const { error } = await supabase.from("staff_profiles").insert({
    organization_id: orgId,
    ...parsed,
    email: parsed.email || null,
  });
  if (error) throw new Error(error.message);
}

export async function deleteStaff(id: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("staff_profiles")
    .update({ is_active: false })
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw new Error(error.message);
}
