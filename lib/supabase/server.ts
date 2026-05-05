import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Server-side Supabase client authenticated with the Clerk user's JWT.
 * Respects RLS policies. Use for reads scoped to the user's orgs.
 * For writes, prefer createAdminClient() from ./admin.ts (after Clerk auth check).
 */
export async function createServerClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: { persistSession: false },
    }
  );
}
