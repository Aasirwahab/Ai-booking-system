import { getCurrentUser } from "@/lib/auth";
import { getNicheSettings } from "@/lib/auth/niche";
import { RealtimeProvider } from "@/components/dashboard/realtime-provider";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getActivityLogs } from "@/actions/activity";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getCurrentUser({ requireOrg: true });
  const labels = await getNicheSettings(ctx.org!.id);
  const activityLogs = await getActivityLogs();

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
      <DashboardSidebar 
        orgName={ctx.org!.name} 
        industry={ctx.org!.industry} 
        labels={{
          booking_label_plural: labels.booking_label_plural,
          contact_label_plural: labels.contact_label_plural,
          service_label_plural: labels.service_label_plural,
          staff_label_plural: labels.staff_label_plural,
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader userName={ctx.firstName ?? ctx.email} orgId={ctx.org!.id} initialNotifications={activityLogs} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <RealtimeProvider orgId={ctx.org!.id}>
            <div className="p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </RealtimeProvider>
        </main>
      </div>
    </div>
  );
}
