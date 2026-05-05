import { getAvailability, createAvailability, deleteAvailability } from "@/actions/availability";
import { DAYS } from "@/lib/constants";
import { getStaff } from "@/actions/staff";
import { getNicheSettings } from "@/lib/auth/niche";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";

export default async function AvailabilityPage() {
  const orgId = await getOrgId();
  const labels = await getNicheSettings(orgId);
  const [rules, staff] = await Promise.all([getAvailability(), getStaff()]);

  async function handleCreate(formData: FormData) {
    "use server";
    await createAvailability(formData);
    revalidatePath("/dashboard/availability");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteAvailability(id);
    revalidatePath("/dashboard/availability");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Availability</h1>

      {staff.length === 0 ? (
        <p className="text-muted-foreground">
          Add a {labels.staff_label.toLowerCase()} first before setting availability.
        </p>
      ) : (
        <>
          <form action={handleCreate} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 p-4 border rounded-lg">
            <select 
              name="staff_id" 
              required 
              aria-label={`Select ${labels.staff_label}`}
              title={`Select ${labels.staff_label}`}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select {labels.staff_label}</option>
              {staff.map((s: any) => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
            <select 
              name="day_of_week" 
              required 
              aria-label="Select day of week"
              title="Select day of week"
              className="border rounded px-3 py-2 text-sm"
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </select>
            <input 
              name="start_time" 
              type="time" 
              defaultValue="09:00" 
              required 
              aria-label="Start time"
              title="Start time"
              className="border rounded px-3 py-2 text-sm" 
            />
            <input 
              name="end_time" 
              type="time" 
              defaultValue="17:00" 
              required 
              aria-label="End time"
              title="End time"
              className="border rounded px-3 py-2 text-sm" 
            />
            <button type="submit" className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium hover:bg-primary/90">
              Add Rule
            </button>
          </form>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">{labels.staff_label}</th>
                  <th className="text-left px-4 py-3 font-medium">Day</th>
                  <th className="text-left px-4 py-3 font-medium">Start</th>
                  <th className="text-left px-4 py-3 font-medium">End</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No availability rules yet
                    </td>
                  </tr>
                )}
                {rules.map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{r.staff?.full_name ?? "—"}</td>
                    <td className="px-4 py-3">{DAYS[r.day_of_week]}</td>
                    <td className="px-4 py-3">{r.start_time}</td>
                    <td className="px-4 py-3">{r.end_time}</td>
                    <td className="px-4 py-3">
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={r.id} />
                        <button type="submit" className="text-destructive text-xs hover:underline">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
