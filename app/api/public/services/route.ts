import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("org");
  if (!slug) return NextResponse.json({ error: "org param required" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data } = await supabase
    .from("services")
    .select("id, name, description, duration_minutes, price, category")
    .eq("organization_id", org.id)
    .eq("is_active", true)
    .order("name");

  return NextResponse.json(data ?? []);
}
