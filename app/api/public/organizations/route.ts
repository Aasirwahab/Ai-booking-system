import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, industry, logo_url")
    .eq("slug", slug)
    .single();

  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Get niche labels
  const { data: niche } = await supabase
    .from("niche_settings")
    .select("contact_label, booking_label, service_label, staff_label")
    .eq("organization_id", org.id)
    .single();

  return NextResponse.json({ ...org, labels: niche });
}
