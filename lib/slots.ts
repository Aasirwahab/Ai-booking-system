import { createAdminClient } from "@/lib/supabase/admin";

export interface TimeSlot {
  start_time: string; // ISO string
  end_time: string;
  staff_id: string;
  staff_name: string;
}

/**
 * Compute available time slots for a given date, service, and optionally a specific staff member.
 */
export async function getAvailableSlots(
  orgId: string,
  serviceId: string,
  date: string, // YYYY-MM-DD
  staffId?: string
): Promise<TimeSlot[]> {
  const supabase = createAdminClient();

  // 1. Get service duration
  const { data: service } = await supabase
    .from("services")
    .select("duration_minutes, buffer_minutes")
    .eq("id", serviceId)
    .eq("organization_id", orgId)
    .single();

  if (!service) return [];

  const duration = service.duration_minutes + service.buffer_minutes;

  // 2. Get day of week for the date
  // Parse date string (YYYY-MM-DD) carefully to avoid timezone shifts
  const [year, month, day] = date.split("-").map(Number);
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  // 3. Get availability rules for that day
  let rulesQuery = supabase
    .from("availability_rules")
    .select("*, staff:staff_profiles(id, full_name)")
    .eq("organization_id", orgId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true);

  if (staffId) {
    rulesQuery = rulesQuery.eq("staff_id", staffId);
  }

  const { data: rules } = await rulesQuery;
  if (!rules || rules.length === 0) return [];

  // 4. Get existing bookings for that date
  const dateStart = `${date}T00:00:00`;
  const dateEnd = `${date}T23:59:59`;

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("staff_id, start_time, end_time")
    .eq("organization_id", orgId)
    .gte("start_time", dateStart)
    .lte("start_time", dateEnd)
    .in("status", ["pending", "confirmed"]);

  const bookedSlots = existingBookings ?? [];

  // 5. Compute free slots
  const slots: TimeSlot[] = [];

  for (const rule of rules) {
    const staffInfo = rule.staff as any;
    const [startH, startM] = rule.start_time.split(":").map(Number);
    const [endH, endM] = rule.end_time.split(":").map(Number);

    let cursor = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (cursor + duration <= end) {
      const slotStartH = String(Math.floor(cursor / 60)).padStart(2, "0");
      const slotStartM = String(cursor % 60).padStart(2, "0");
      const slotEndMinutes = cursor + service.duration_minutes;
      const slotEndH = String(Math.floor(slotEndMinutes / 60)).padStart(2, "0");
      const slotEndM = String(slotEndMinutes % 60).padStart(2, "0");

      const slotStart = `${date}T${slotStartH}:${slotStartM}:00`;
      const slotEnd = `${date}T${slotEndH}:${slotEndM}:00`;

      // Check for conflicts
      const hasConflict = bookedSlots.some(
        (b) =>
          b.staff_id === rule.staff_id &&
          slotStart < b.end_time &&
          slotEnd > b.start_time
      );

      if (!hasConflict) {
        slots.push({
          start_time: slotStart,
          end_time: slotEnd,
          staff_id: rule.staff_id,
          staff_name: staffInfo?.full_name ?? "Staff",
        });
      }

      cursor += duration; // move by duration + buffer
    }
  }

  return slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
}
