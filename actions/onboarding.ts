"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getNicheLabels } from "@/lib/niches";

const onboardingSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  niche_type: z.string().min(1),
});

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = onboardingSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    niche_type: formData.get("niche_type"),
  });

  const supabase = createAdminClient();

  // Check slug is unique
  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", parsed.slug)
    .single();

  if (existing) {
    throw new Error("This URL slug is already taken. Please choose another.");
  }

  // Create organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: parsed.name,
      slug: parsed.slug,
      industry: parsed.niche_type,
    })
    .select()
    .single();

  if (orgError || !org) throw new Error(orgError?.message ?? "Failed to create organization");

  // Create membership
  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: org.id,
      user_id: userId,
      role: "owner",
    });

  if (memberError) throw new Error(memberError.message);

  // Create niche settings from preset
  const labels = getNicheLabels(parsed.niche_type);
  const { error: nicheError } = await supabase
    .from("niche_settings")
    .insert({
      organization_id: org.id,
      niche_type: parsed.niche_type,
      contact_label: labels.contact_label,
      contact_label_plural: labels.contact_label_plural,
      staff_label: labels.staff_label,
      staff_label_plural: labels.staff_label_plural,
      booking_label: labels.booking_label,
      booking_label_plural: labels.booking_label_plural,
      service_label: labels.service_label,
      service_label_plural: labels.service_label_plural,
    });

  if (nicheError) throw new Error(nicheError.message);

  redirect("/dashboard");
}
