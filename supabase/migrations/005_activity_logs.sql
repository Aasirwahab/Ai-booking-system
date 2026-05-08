-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'booking_created', 'booking_confirmed', 'contact_created', 'ai_interaction'
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their organization's logs" ON activity_logs
    FOR SELECT USING (organization_id IN (SELECT user_org_ids()));

-- Add Realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
