"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getDashboardStats(orgId: string) {
  const supabase = createAdminClient();

  // Fetch counts
  const [bookings, contacts, services, aiConversations] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId),
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId),
    supabase
      .from("ai_conversations")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId),
  ]);

  // Fetch total revenue from completed bookings
  const { data: revenueData } = await supabase
    .from("bookings")
    .select(`
      id,
      status,
      services (
        price
      )
    `)
    .eq("organization_id", orgId)
    .eq("status", "completed");

  const totalRevenue = revenueData?.reduce((acc, booking: any) => {
    return acc + (Number(booking.services?.price) || 0);
  }, 0) || 0;

  return {
    totalBookings: bookings.count ?? 0,
    totalContacts: contacts.count ?? 0,
    totalServices: services.count ?? 0,
    totalRevenue: totalRevenue,
    totalAiConversations: aiConversations.count ?? 0,
  };
}
