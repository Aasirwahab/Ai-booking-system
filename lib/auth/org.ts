import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns the organization_id for the current Clerk user.
 * Throws if not authenticated or has no org.
 */
export async function getOrgId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (!data) throw new Error("No organization found");
  return data.organization_id;
}
