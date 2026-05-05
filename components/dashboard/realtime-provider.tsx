"use client";

import { useRealtimeBookings } from "@/hooks/use-realtime-bookings";

/**
 * Drop this into the dashboard layout to enable realtime updates.
 * It subscribes to Supabase Realtime and invalidates queries on changes.
 */
export function RealtimeProvider({
  orgId,
  children,
}: {
  orgId: string;
  children: React.ReactNode;
}) {
  useRealtimeBookings(orgId);
  return <>{children}</>;
}
