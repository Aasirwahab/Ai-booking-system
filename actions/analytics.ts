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

  // Get daily revenue and booking counts for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: weeklyData } = await supabase
    .from("bookings")
    .select("created_at, status, service:services(price, name, category)")
    .eq("organization_id", orgId)
    .gte("created_at", sevenDaysAgo.toISOString());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      name: days[d.getDay()],
      dateStr: d.toISOString().split("T")[0],
      revenue: 0,
      count: 0
    };
  });

  const serviceMap: Record<string, number> = {};

  (weeklyData ?? []).forEach((b: any) => {
    const dateStr = b.created_at.split("T")[0];
    const day = last7Days.find(d => d.dateStr === dateStr);
    if (day) {
      day.count++;
      if (["confirmed", "completed"].includes(b.status)) {
        day.revenue += b.service?.price ?? 0;
      }
    }

    // Service distribution for pie chart
    const category = b.service?.category || "Other";
    serviceMap[category] = (serviceMap[category] || 0) + 1;
  });

  const serviceDistribution = Object.entries(serviceMap).map(([name, value], i) => ({
    name,
    value,
    color: i === 0 ? "#1e293b" : i === 1 ? "#C1FF72" : "#cbd5e1"
  }));

  // Get recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("id, start_time, status, contact:contacts(full_name), service:services(name, price)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get activity logs
  const { data: activityLogs } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalBookings: totalBookings ?? 0,
    totalRevenue,
    totalClients: totalClients ?? 0,
    recentBookings: recentBookings ?? [],
    weeklyRevenue: last7Days.map(d => ({ name: d.name, revenue: d.revenue })),
    appointmentTrends: last7Days.map(d => ({ name: d.name, count: d.count })),
    serviceDistribution: serviceDistribution.length > 0 ? serviceDistribution : [
      { name: "No Data", value: 1, color: "#f1f5f9" }
    ],
    activityLogs: activityLogs ?? []
  };
}
