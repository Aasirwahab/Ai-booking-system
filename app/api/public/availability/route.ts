import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("org");
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD
  const staffId = req.nextUrl.searchParams.get("staffId") ?? undefined;

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

  const slots = await getAvailableSlots(org.id, serviceId, date, staffId);
  return NextResponse.json(slots);
}
