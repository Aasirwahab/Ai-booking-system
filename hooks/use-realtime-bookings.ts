"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Subscribe to real-time booking changes for an organization.
 * Invalidates React Query cache so the dashboard updates without refresh.
 */
export function useRealtimeBookings(orgId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bookings", orgId] });
    router.refresh();
  }, [queryClient, orgId, router]);

  useEffect(() => {
    const supabase = createBrowserClient();

    const channel = supabase
      .channel(`bookings:${orgId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `organization_id=eq.${orgId}`,
        },
        handleChange
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contacts",
          filter: `organization_id=eq.${orgId}`,
        },
        handleChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, handleChange]);
}
