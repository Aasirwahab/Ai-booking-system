import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("org");
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD
  const staffId = req.nextUrl.searchParams.get("staffId") ?? undefined;
  const debug = req.nextUrl.searchParams.get("debug");

  if (!slug || !serviceId || !date) {
    return NextResponse.json({ error: "org, serviceId, date required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Debug: show raw booking data from Supabase to diagnose conflict detection
  if (debug === "1") {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("staff_id, start_time, end_time, status")
      .eq("organization_id", org.id)
      .gte("start_time", `${date}T00:00:00`)
      .lte("start_time", `${date}T23:59:59`)
      .in("status", ["pending", "confirmed"]);

    const slots = await getAvailableSlots(org.id, serviceId, date, staffId);
    return NextResponse.json({ slots, _debug: { bookings, date } });
  }

  const slots = await getAvailableSlots(org.id, serviceId, date, staffId);
  return NextResponse.json(slots);
}
