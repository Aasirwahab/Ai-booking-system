import { createAdminClient } from "@/lib/supabase/admin";
import { getNicheLabels, type NicheLabels } from "@/lib/niches";
import type { NicheSettings } from "@/types/database";

/**
 * Fetch niche_settings row for an organization.
 * Falls back to the "custom" preset if none found.
 */
export async function getNicheSettings(orgId: string): Promise<NicheSettings & NicheLabels> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("niche_settings")
    .select("*")
    .eq("organization_id", orgId)
    .single();

  if (data) {
    const preset = getNicheLabels(data.niche_type);
    return { ...data, display_name: preset.display_name, description: preset.description };
  }

  // Fallback
  const fallback = getNicheLabels("custom");
  return {
    ...fallback,
    id: "",
    organization_id: orgId,
    custom_fields: [],
    created_at: "",
    updated_at: "",
  };
}
