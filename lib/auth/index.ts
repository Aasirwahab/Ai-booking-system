import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Organization, OrganizationMember } from "@/types/database";

export interface CurrentUserContext {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  org: Organization | null;
  membership: OrganizationMember | null;
}

/**
 * Get the current authenticated user + their organization from Supabase.
 * Redirects to sign-in if not authenticated.
 * Redirects to onboarding if authenticated but no organization exists.
 */
export async function getCurrentUser(opts?: {
  requireOrg?: boolean;
}): Promise<CurrentUserContext> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  // Find their org membership
  const { data: membership } = await supabase
    .from("organization_members")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .single();

  let org: Organization | null = null;

  if (membership) {
    const { data } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", membership.organization_id)
      .single();
    org = data;
  }

  // If org required but none exists, send to onboarding
  if (opts?.requireOrg && !org) {
    redirect("/onboarding");
  }

  return {
    userId,
    email: user.emailAddresses[0]?.emailAddress ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    org,
    membership,
  };
}
