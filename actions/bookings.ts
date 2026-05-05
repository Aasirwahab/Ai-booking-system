"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrgId } from "@/lib/auth/org";
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
  return data;
}

export async function updateBookingStatus(id: string, status: string) {
  const orgId = await getOrgId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw new Error(error.message);
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
  return data;
}
