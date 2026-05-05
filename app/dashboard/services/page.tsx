import { getServices, createService, deleteService } from "@/actions/services";
import { getNicheSettings } from "@/lib/auth/niche";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";
import { ServiceCard } from "@/components/dashboard/service-card";
import { AddServiceDialog } from "@/components/dashboard/add-service-dialog";
import { Layers } from "lucide-react";

export default async function ServicesPage() {
  const orgId = await getOrgId();
  const labels = await getNicheSettings(orgId);
  const services = await getServices();

  async function handleCreate(formData: FormData) {
    "use server";
    await createService(formData);
    revalidatePath("/dashboard/services");
  }


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
            {labels.service_label_plural}
          </h1>
          <p className="text-slate-400 font-bold mt-1">
            Manage the {labels.service_label_plural.toLowerCase()} offered by your business.
          </p>
        </div>
        <AddServiceDialog labels={labels} onSubmit={handleCreate} />
      </div>

      {services.length === 0 ? (
        <div className="premium-card p-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-100">
          <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6">
            <Layers className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-[#0f172a] mb-2">No {labels.service_label_plural.toLowerCase()} found</h3>
          <p className="text-slate-400 font-bold max-w-xs mx-auto mb-8">
            Start by adding your first {labels.service_label.toLowerCase()} to enable bookings for your clients.
          </p>
          <AddServiceDialog labels={labels} onSubmit={handleCreate} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service as any} 
              labels={labels}
            />
          ))}
        </div>
      )}
    </div>
  );
}
