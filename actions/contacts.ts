"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";

const contactSchema = z.object({
  full_name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

export async function getContacts() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contacts")
    .select("*")
    .eq("organization_id", orgId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createContact(formData: FormData) {
  const orgId = await getOrgId();
  const parsed = contactSchema.parse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes"),
    source: formData.get("source") || "manual",
  });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      organization_id: orgId,
      ...parsed,
      email: parsed.email || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteContact(id: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contacts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw new Error(error.message);
}
