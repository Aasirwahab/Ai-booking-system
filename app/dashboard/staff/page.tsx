import { getStaff, createStaff, deleteStaff } from "@/actions/staff";
import { getNicheSettings } from "@/lib/auth/niche";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";
import { StaffCard } from "@/components/dashboard/staff-card";
import { AddStaffDialog } from "@/components/dashboard/add-staff-dialog";
import { Users } from "lucide-react";

export default async function StaffPage() {
  const orgId = await getOrgId();
  const labels = await getNicheSettings(orgId);
  const staff = await getStaff();

  async function handleCreate(formData: FormData) {
    "use server";
    await createStaff(formData);
    revalidatePath("/dashboard/staff");
  }

  async function handleDelete(id: string) {
    "use server";
    await deleteStaff(id);
    revalidatePath("/dashboard/staff");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
            {labels.staff_label_plural}
          </h1>
          <p className="text-slate-400 font-bold mt-1">
            Manage your team of {labels.staff_label_plural.toLowerCase()} and their availability.
          </p>
        </div>
        <AddStaffDialog labels={labels} onSubmit={handleCreate} />
      </div>

      {staff.length === 0 ? (
        <div className="premium-card p-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100">
          <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-[#0f172a] mb-2">No {labels.staff_label_plural.toLowerCase()} found</h3>
          <p className="text-slate-400 font-bold max-w-xs mx-auto mb-8">
            Add your team members to start assigning them to {labels.service_label_plural.toLowerCase()}.
          </p>
          <AddStaffDialog labels={labels} onSubmit={handleCreate} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {staff.map((member) => (
            <StaffCard 
              key={member.id} 
              member={member as any} 
              labels={labels}
              onDelete={handleDelete}
              onEdit={() => {}} // TODO: Implement edit
            />
          ))}
        </div>
      )}
    </div>
  );
}
