"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";

export async function getDashboardStats() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();

  // Get total bookings
  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", orgId);

  // Get total revenue (completed/confirmed bookings)
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("service:services(price)")
    .eq("organization_id", orgId)
    .in("status", ["confirmed", "completed"]);

  const totalRevenue = (revenueData ?? []).reduce((acc, curr: any) => {
    return acc + (curr.service?.price ?? 0);
  }, 0);

  // Get total clients
  const { count: totalClients } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", orgId)
    .is("deleted_at", null);

  // Get recent activity (verified patients)
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("id, start_time, status, contact:contacts(full_name), service:services(name, price)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalBookings: totalBookings ?? 0,
    totalRevenue,
    totalClients: totalClients ?? 0,
    recentBookings: recentBookings ?? [],
  };
}
