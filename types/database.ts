// Hand-written types matching 001_schema.sql.
// Replace with `supabase gen types typescript` once the CLI is linked.

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
  | "rescheduled";

export type MemberRole = "owner" | "admin" | "staff" | "viewer";

export type BookingSource =
  | "manual"
  | "public_page"
  | "embed"
  | "widget"
  | "api";

// ----- Row types -----

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string;
  logo_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
  updated_at: string;
}

export interface NicheSettings {
  id: string;
  organization_id: string;
  niche_type: string;
  contact_label: string;
  contact_label_plural: string;
  staff_label: string;
  staff_label_plural: string;
  booking_label: string;
  booking_label_plural: string;
  service_label: string;
  service_label_plural: string;
  custom_fields: unknown[];
  created_at: string;
  updated_at: string;
}

export interface NichePreset {
  niche_type: string;
  contact_label: string;
  contact_label_plural: string;
  staff_label: string;
  staff_label_plural: string;
  booking_label: string;
  booking_label_plural: string;
  service_label: string;
  service_label_plural: string;
}

export interface StaffProfile {
  id: string;
  organization_id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  role_title: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
  category: string | null;
  buffer_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityRule {
  id: string;
  organization_id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  source: string | null;
  tags: string[];
  notes: string | null;
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Booking {
  id: string;
  organization_id: string;
  contact_id: string;
  service_id: string;
  staff_id: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  source: BookingSource;
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiConversation {
  id: string;
  organization_id: string;
  contact_id: string | null;
  channel: string;
  status: string;
  summary: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_name: string | null;
  tool_input: unknown | null;
  tool_output: unknown | null;
  created_at: string;
}

// ----- Insert types (omit auto-generated fields) -----

export type OrganizationInsert = Omit<Organization, "id" | "created_at" | "updated_at">;
export type ContactInsert = Omit<Contact, "id" | "created_at" | "updated_at" | "deleted_at">;
export type ServiceInsert = Omit<Service, "id" | "created_at" | "updated_at">;
export type StaffProfileInsert = Omit<StaffProfile, "id" | "created_at" | "updated_at">;
export type BookingInsert = Omit<Booking, "id" | "created_at" | "updated_at">;
export type AvailabilityRuleInsert = Omit<AvailabilityRule, "id" | "created_at" | "updated_at">;
