import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client for Realtime subscriptions.
 * Uses anon key — RLS controls what's visible.
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
