import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { UnifiedBookingWidget } from "@/components/widget/booking-widget";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmbedChatPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, industry, widget_color, welcome_message")
    .eq("slug", slug)
    .single();

  if (!org) notFound();

  const { data: niche } = await supabase
    .from("niche_settings")
    .select("booking_label, service_label, staff_label, patient_label")
    .eq("organization_id", org.id)
    .single();

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <UnifiedBookingWidget 
        orgSlug={org.slug} 
        orgName={org.name}
        industry={org.industry}
        widgetColor={org.widget_color}
        welcomeMessage={org.welcome_message}
        labels={{
          service: niche?.service_label || "Service",
          staff: niche?.staff_label || "Staff",
          booking: niche?.booking_label || "Booking",
          patient: niche?.patient_label || "Client"
        }}
      />
    </div>
  );
}

