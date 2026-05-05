import { getBookings } from "@/actions/bookings";
import { getNicheSettings } from "@/lib/auth/niche";
import { getOrgId } from "@/lib/auth/org";
import { BookingsView } from "@/components/dashboard/bookings-view";

export default async function BookingsPage() {
  const orgId = await getOrgId();
  const labels = await getNicheSettings(orgId);
  const bookings = await getBookings();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">{labels.booking_label_plural}</h1>
        <p className="text-slate-400 font-bold mt-1">
          Manage your schedule and appointment pipeline.
        </p>
      </div>

      <BookingsView 
        bookings={bookings} 
        labels={labels} 
      />
    </div>
  );
}
