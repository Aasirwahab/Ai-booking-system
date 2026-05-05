export interface NicheLabels {
  niche_type: string;
  display_name: string;
  description: string;
  contact_label: string;
  contact_label_plural: string;
  staff_label: string;
  staff_label_plural: string;
  booking_label: string;
  booking_label_plural: string;
  service_label: string;
  service_label_plural: string;
}

export const NICHE_PRESETS: Record<string, NicheLabels> = {
  clinic: {
    niche_type: "clinic",
    display_name: "Clinic / Healthcare",
    description: "Hospitals, dental clinics, physiotherapy",
    contact_label: "Patient",
    contact_label_plural: "Patients",
    staff_label: "Doctor",
    staff_label_plural: "Doctors",
    booking_label: "Appointment",
    booking_label_plural: "Appointments",
    service_label: "Treatment",
    service_label_plural: "Treatments",
  },
  salon: {
    niche_type: "salon",
    display_name: "Beauty Salon / Spa",
    description: "Hair salons, nail bars, spas",
    contact_label: "Client",
    contact_label_plural: "Clients",
    staff_label: "Stylist",
    staff_label_plural: "Stylists",
    booking_label: "Booking",
    booking_label_plural: "Bookings",
    service_label: "Treatment",
    service_label_plural: "Treatments",
  },
  fitness: {
    niche_type: "fitness",
    display_name: "Fitness / Coaching",
    description: "Gyms, personal trainers, yoga studios",
    contact_label: "Member",
    contact_label_plural: "Members",
    staff_label: "Coach",
    staff_label_plural: "Coaches",
    booking_label: "Session",
    booking_label_plural: "Sessions",
    service_label: "Class",
    service_label_plural: "Classes",
  },
  tutoring: {
    niche_type: "tutoring",
    display_name: "Tutoring / Education",
    description: "Tutors, language schools, music teachers",
    contact_label: "Student",
    contact_label_plural: "Students",
    staff_label: "Tutor",
    staff_label_plural: "Tutors",
    booking_label: "Lesson",
    booking_label_plural: "Lessons",
    service_label: "Course",
    service_label_plural: "Courses",
  },
  real_estate: {
    niche_type: "real_estate",
    display_name: "Real Estate",
    description: "Estate agents, property viewings",
    contact_label: "Lead",
    contact_label_plural: "Leads",
    staff_label: "Agent",
    staff_label_plural: "Agents",
    booking_label: "Viewing",
    booking_label_plural: "Viewings",
    service_label: "Valuation",
    service_label_plural: "Valuations",
  },
  legal: {
    niche_type: "legal",
    display_name: "Legal / Professional",
    description: "Solicitors, accountants, consultants",
    contact_label: "Client",
    contact_label_plural: "Clients",
    staff_label: "Solicitor",
    staff_label_plural: "Solicitors",
    booking_label: "Consultation",
    booking_label_plural: "Consultations",
    service_label: "Legal Service",
    service_label_plural: "Legal Services",
  },
  agency: {
    niche_type: "agency",
    display_name: "Agency / Consulting",
    description: "Marketing agencies, design studios",
    contact_label: "Client",
    contact_label_plural: "Clients",
    staff_label: "Consultant",
    staff_label_plural: "Consultants",
    booking_label: "Discovery Call",
    booking_label_plural: "Discovery Calls",
    service_label: "Service",
    service_label_plural: "Services",
  },
  custom: {
    niche_type: "custom",
    display_name: "Custom / Other",
    description: "Set your own labels",
    contact_label: "Client",
    contact_label_plural: "Clients",
    staff_label: "Staff",
    staff_label_plural: "Staff",
    booking_label: "Booking",
    booking_label_plural: "Bookings",
    service_label: "Service",
    service_label_plural: "Services",
  },
};

export const NICHE_TYPES = Object.keys(NICHE_PRESETS);

export function getNicheLabels(nicheType: string): NicheLabels {
  return NICHE_PRESETS[nicheType] ?? NICHE_PRESETS.custom;
}
