"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";
import { logActivity } from "@/actions/activity";
import type { BookingSource } from "@/types/database";

const bookingSchema = z.object({
  contact_id: z.string().uuid(),
  service_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  start_time: z.string(),
  end_time: z.string(),
  source: z.string().default("manual") as z.ZodType<BookingSource>,
  notes: z.string().optional(),
});

export async function getBookings() {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, contact:contacts(full_name, email), service:services(name, duration_minutes), staff:staff_profiles(full_name)")
    .eq("organization_id", orgId)
    .order("start_time", { ascending: false });
  return data ?? [];
}

export async function createBooking(input: {
  contact_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  source?: BookingSource;
  notes?: string;
}) {
  const orgId = await getOrgId();
  const parsed = bookingSchema.parse(input);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      organization_id: orgId,
      ...parsed,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logActivity(
    "booking_created",
    `New booking created`,
    `A new appointment was scheduled via ${parsed.source}`,
    { booking_id: data.id }
  );

  return data;
}

export async function updateBookingStatus(id: string, status: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();

  // Get the booking to find the associated contact
  const { data: booking } = await supabase
    .from("bookings")
    .select("contact_id, contact:contacts(status, source)")
    .eq("id", id)
    .eq("organization_id", orgId)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw new Error(error.message);

  // When confirming a booking, activate the contact if it was pending from a public booking
  if (status === "confirmed" && booking?.contact_id) {
    const contact = booking.contact as any;
    if (contact?.status === "pending" && contact?.source === "public_page") {
      await supabase
        .from("contacts")
        .update({ status: "active" })
        .eq("id", booking.contact_id)
        .eq("organization_id", orgId);
    }
  }

  await logActivity(
    status === "pending" ? "booking_pending" : "booking_updated",
    status === "pending" ? "New pending booking" : "Booking status updated",
    `Appointment status changed to ${status}`,
    { booking_id: id, status }
  );
}

/**
 * Create a booking from the public API (no auth required).
 * Caller must provide orgId directly.
 */
export async function createPublicBooking(orgId: string, input: {
  contact_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  notes?: string;
}) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      organization_id: orgId,
      ...input,
      source: "public_page" as BookingSource,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Log activity using direct insert since it's a public action
  await supabase
    .from("activity_logs")
    .insert({
      organization_id: orgId,
      type: "booking_created",
      title: "New appointment scheduled (Public)",
      description: "A new appointment was scheduled via the public booking page",
      metadata: { booking_id: data.id }
    });

  return data;
}
