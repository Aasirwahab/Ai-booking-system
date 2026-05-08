"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";

export function RealtimeDashboard({ orgId }: { orgId: string }) {
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    // Listen for changes in bookings
    const bookingsChannel = supabase
      .channel("realtime-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `organization_id=eq.${orgId}`
        },
        () => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
          filter: `organization_id=eq.${orgId}`
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
    };
  }, [orgId, router, supabase]);

  return null;
}
