import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/app/book/[slug]/booking-widget";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmbedBookingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug, industry")
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
    <div className="p-4">
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
  );
}
