import { getAvailability, createAvailability } from "@/actions/availability";
import { getStaff } from "@/actions/staff";
import { getNicheSettings } from "@/lib/auth/niche";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";
import { AvailabilityForm } from "@/components/dashboard/availability-form";
import { AvailabilityList } from "@/components/dashboard/availability-list";

export default async function AvailabilityPage() {
  const orgId = await getOrgId();
  const labels = await getNicheSettings(orgId);
  const [rules, staff] = await Promise.all([getAvailability(), getStaff()]);

  async function handleCreate(formData: FormData) {
    "use server";
    await createAvailability(formData);
    revalidatePath("/dashboard/availability");
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
            Schedule & Availability
          </h1>
          <p className="text-slate-400 font-bold mt-1">
            Configure working hours for your {labels.staff_label_plural.toLowerCase()}.
          </p>
        </div>
      </div>

      {staff.length === 0 ? (
        <div className="premium-card p-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100">
          <p className="text-slate-400 font-bold max-w-xs mx-auto">
            Add a {labels.staff_label.toLowerCase()} first before setting availability.
          </p>
        </div>
      ) : (
        <>
          <AvailabilityForm 
            staff={staff} 
            labels={labels} 
            onSubmit={handleCreate} 
          />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#0f172a]">Active Schedules</h2>
            </div>
            <AvailabilityList 
              rules={rules} 
              labels={labels} 
            />
          </div>
        </>
      )}
    </div>
  );
}
