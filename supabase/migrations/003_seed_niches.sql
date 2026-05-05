-- ============================================
-- 003_seed_niches.sql — Default niche label presets
-- ============================================
-- These are reference rows. When a user picks a niche during onboarding,
-- we copy these labels into their niche_settings row.
-- Stored as a simple lookup table.

CREATE TABLE niche_presets (
  niche_type TEXT PRIMARY KEY,
  contact_label TEXT NOT NULL,
  contact_label_plural TEXT NOT NULL,
  staff_label TEXT NOT NULL,
  staff_label_plural TEXT NOT NULL,
  booking_label TEXT NOT NULL,
  booking_label_plural TEXT NOT NULL,
  service_label TEXT NOT NULL,
  service_label_plural TEXT NOT NULL
);

INSERT INTO niche_presets (niche_type, contact_label, contact_label_plural, staff_label, staff_label_plural, booking_label, booking_label_plural, service_label, service_label_plural) VALUES
  ('clinic',      'Patient',  'Patients',  'Doctor',      'Doctors',      'Appointment', 'Appointments', 'Treatment',     'Treatments'),
  ('salon',       'Client',   'Clients',   'Stylist',     'Stylists',     'Booking',     'Bookings',     'Treatment',     'Treatments'),
  ('fitness',     'Member',   'Members',   'Coach',       'Coaches',      'Session',     'Sessions',     'Class',         'Classes'),
  ('tutoring',    'Student',  'Students',  'Tutor',       'Tutors',       'Lesson',      'Lessons',      'Course',        'Courses'),
  ('real_estate', 'Lead',     'Leads',     'Agent',       'Agents',       'Viewing',     'Viewings',     'Valuation',     'Valuations'),
  ('legal',       'Client',   'Clients',   'Solicitor',   'Solicitors',   'Consultation','Consultations','Legal Service', 'Legal Services'),
  ('agency',      'Client',   'Clients',   'Consultant',  'Consultants',  'Discovery Call','Discovery Calls','Service',   'Services'),
  ('custom',      'Client',   'Clients',   'Staff',       'Staff',        'Booking',     'Bookings',     'Service',       'Services');
