import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  organizationSlug: z.string(),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  startTime: z.string(),
  endTime: z.string(),
  customer: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    gender: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { organizationSlug, serviceId, staffId, startTime, endTime, customer, notes } = parsed.data;
  const supabase = createAdminClient();

  // Resolve org
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", organizationSlug)
    .single();

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  // Find or create contact
  let contact;
  const { data: existing } = await supabase
    .from("contacts")
    .select("id")
    .eq("organization_id", org.id)
    .eq("email", customer.email)
    .is("deleted_at", null)
    .single();

  if (existing) {
    contact = existing;
  } else {
    const { data: created, error } = await supabase
      .from("contacts")
      .insert({
        organization_id: org.id,
        full_name: customer.fullName,
        email: customer.email,
        phone: customer.phone || null,
        source: "public_page",
        custom_fields: customer.gender ? { gender: customer.gender } : {},
      })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    contact = created;
  }

  // Create booking
  const { data: booking, error: bookError } = await supabase
    .from("bookings")
    .insert({
      organization_id: org.id,
      contact_id: contact!.id,
      service_id: serviceId,
      staff_id: staffId,
      start_time: startTime,
      end_time: endTime,
      source: "public_page",
      status: "pending",
      notes: notes || null,
    })
    .select("id, start_time, end_time, status")
    .single();

  if (bookError) return NextResponse.json({ error: bookError.message }, { status: 500 });

  return NextResponse.json({ booking }, { status: 201 });
}
