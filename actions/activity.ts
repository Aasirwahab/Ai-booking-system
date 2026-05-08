"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";

export async function logActivity(type: string, title: string, description?: string, metadata?: any) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("activity_logs")
    .insert({
      organization_id: orgId,
      type,
      title,
      description,
      metadata
    });

  if (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function getActivityLogs() {
  try {
    const orgId = await getOrgId();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      // Log the actual error details, not just the object
      console.error(
        "Failed to fetch activity logs:",
        error.message ?? error.code ?? JSON.stringify(error)
      );
      return [];
    }

    return data ?? [];
  } catch (e: any) {
    // Gracefully handle missing table / auth issues so dashboard still loads
    console.error("Activity logs unavailable:", e?.message ?? e);
    return [];
  }
}
