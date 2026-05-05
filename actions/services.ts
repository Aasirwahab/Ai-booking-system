"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";

const serviceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  duration_minutes: z.coerce.number().int().min(5).max(480),
  price: z.coerce.number().min(0).optional(),
  category: z.string().optional(),
  buffer_minutes: z.coerce.number().int().min(0).max(120).default(0),
});

export async function getServices() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("organization_id", orgId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createService(formData: FormData) {
  const orgId = await getOrgId();
  const parsed = serviceSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    duration_minutes: formData.get("duration_minutes"),
    price: formData.get("price") || undefined,
    category: formData.get("category"),
    buffer_minutes: formData.get("buffer_minutes") || 0,
  });

  const supabase = createAdminClient();
  const { error } = await supabase.from("services").insert({
    organization_id: orgId,
    ...parsed,
  });
  if (error) throw new Error(error.message);
}

export async function updateService(id: string, formData: FormData) {
  const orgId = await getOrgId();
  const parsed = serviceSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    duration_minutes: formData.get("duration_minutes"),
    price: formData.get("price") || undefined,
    category: formData.get("category"),
    buffer_minutes: formData.get("buffer_minutes") || 0,
  });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("services")
    .update(parsed)
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw new Error(error.message);
}

export async function deleteService(id: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("services")
    .update({ is_active: false })
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw new Error(error.message);
}
