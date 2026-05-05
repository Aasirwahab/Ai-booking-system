-- ============================================
-- 002_rls.sql — Row Level Security policies
-- ============================================
-- Strategy: RLS enabled on all tables, deny by default.
-- The app uses service_role key server-side (after Clerk auth check).
-- Anon key has no access — public booking endpoints go through server actions.
-- Realtime uses anon key but we'll grant SELECT on specific tables
-- with org_id filtering via Clerk JWT custom claims.

-- Enable RLS on all tenant tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE niche_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Helper: extract Clerk user_id from JWT
-- ============================================
CREATE OR REPLACE FUNCTION auth_user_id()
RETURNS TEXT AS $$
  SELECT coalesce(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  );
$$ LANGUAGE sql STABLE;

-- ============================================
-- Helper: get org IDs the current JWT user belongs to
-- ============================================
CREATE OR REPLACE FUNCTION user_org_ids()
RETURNS SETOF UUID AS $$
  SELECT organization_id
  FROM organization_members
  WHERE user_id = auth_user_id();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================
-- Policies: authenticated users see their own orgs' data
-- ============================================

-- Organizations
CREATE POLICY "Members can view their orgs"
  ON organizations FOR SELECT
  USING (id IN (SELECT user_org_ids()));

-- Organization members
CREATE POLICY "Members can view org members"
  ON organization_members FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- Niche settings
CREATE POLICY "Members can view niche settings"
  ON niche_settings FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- Staff profiles
CREATE POLICY "Members can view staff"
  ON staff_profiles FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- Services
CREATE POLICY "Members can view services"
  ON services FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- Availability rules
CREATE POLICY "Members can view availability"
  ON availability_rules FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- Contacts
CREATE POLICY "Members can view contacts"
  ON contacts FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- Bookings
CREATE POLICY "Members can view bookings"
  ON bookings FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- AI conversations
CREATE POLICY "Members can view conversations"
  ON ai_conversations FOR SELECT
  USING (organization_id IN (SELECT user_org_ids()));

-- AI messages (via conversation)
CREATE POLICY "Members can view messages"
  ON ai_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM ai_conversations
      WHERE organization_id IN (SELECT user_org_ids())
    )
  );

-- ============================================
-- Note: INSERT/UPDATE/DELETE handled server-side
-- via service_role key after Clerk auth verification.
-- No INSERT/UPDATE/DELETE policies needed for anon.
-- ============================================
