import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { BookingWidget } from "./booking-widget";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicBookingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, industry, logo_url")
    .eq("slug", slug)
    .single();

  if (!org) notFound();

  const { data: niche } = await supabase
    .from("niche_settings")
    .select("booking_label, service_label, staff_label")
    .eq("organization_id", org.id)
    .single();

  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, duration_minutes, price")
    .eq("organization_id", org.id)
    .eq("is_active", true)
    .order("name");

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased pb-20">
      {/* Premium Header */}
      <header className="bg-[#0f172a] text-white py-12 px-6 mb-12 shadow-2xl">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[#C1FF72] flex items-center justify-center mb-6 text-[#0f172a] font-black text-2xl shadow-[0_0_30px_rgba(193,255,114,0.3)]">
            {org.name[0]}
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{org.name}</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Official {niche?.booking_label ?? "Booking"} Portal
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        <div className="premium-card bg-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1FF72]/5 rounded-bl-full -mr-16 -mt-16" />
          
          <div className="relative">
            <h2 className="text-2xl font-black text-[#0f172a] mb-8">
              Select a {niche?.service_label?.toLowerCase() ?? "service"}
            </h2>
            
            <BookingWidget
              orgSlug={org.slug}
              services={services ?? []}
              labels={{
                service: niche?.service_label ?? "Service",
                staff: niche?.staff_label ?? "Staff",
                booking: niche?.booking_label ?? "Booking",
              }}
            />
          </div>
        </div>
        
        <footer className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Powered by Doctor AI Agent · Secure Booking
          </p>
        </footer>
      </main>
    </div>
  );
}
