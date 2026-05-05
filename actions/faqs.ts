"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";

export async function getFaqs() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addFaq(question: string, answer: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("faqs")
    .insert({
      organization_id: orgId,
      question,
      answer,
    });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ai-agent");
}

export async function deleteFaq(id: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id)
    .eq("organization_id", orgId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ai-agent");
}

export async function updateFaq(id: string, question: string, answer: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("faqs")
    .update({ question, answer })
    .eq("id", id)
    .eq("organization_id", orgId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/ai-agent");
}
