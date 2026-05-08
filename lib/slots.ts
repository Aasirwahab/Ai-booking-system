import { createAdminClient } from "@/lib/supabase/admin";

export interface TimeSlot {
  start_time: string; // ISO string (naive, represents local business time)
  end_time: string;
  staff_id: string;
  staff_name: string;
  booked: boolean;
}

/**
 * Compute time slots for a given date, service, and optionally a specific staff member.
 * Returns all slots within availability hours, each marked as booked or available.
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

  // 4. Get ALL existing bookings for that date (pending + confirmed)
  // Use broad range covering the full day to catch timezone offsets
  const dayStartLocal = new Date(`${date}T00:00:00`);
  const dayEndLocal = new Date(`${date}T23:59:59`);

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("staff_id, start_time, end_time, status")
    .eq("organization_id", orgId)
    .gte("start_time", dayStartLocal.toISOString())
    .lte("start_time", dayEndLocal.toISOString())
    .in("status", ["pending", "confirmed"]);

  // Convert booking times to millisecond timestamps for comparison
  const bookedRanges = (existingBookings ?? []).map((b) => ({
    staff_id: b.staff_id,
    startMs: new Date(b.start_time).getTime(),
    endMs: new Date(b.end_time).getTime(),
  }));

  // 5. Compute all slots, marking booked ones
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

      // Parse as local time (same timezone as the clinic) for proper UTC comparison
      const slotStartMs = new Date(slotStart).getTime();
      const slotEndMs = new Date(slotEnd).getTime();

      const isBooked = bookedRanges.some(
        (b) =>
          b.staff_id === rule.staff_id &&
          slotStartMs < b.endMs &&
          slotEndMs > b.startMs
      );

      slots.push({
        start_time: slotStart,
        end_time: slotEnd,
        staff_id: rule.staff_id,
        staff_name: staffInfo?.full_name ?? "Staff",
        booked: isBooked,
      });

      cursor += duration;
    }
  }

  return slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
}
