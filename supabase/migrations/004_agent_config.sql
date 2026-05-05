-- Add agent configuration to organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS agent_instructions TEXT,
ADD COLUMN IF NOT EXISTS agent_enabled BOOLEAN DEFAULT true;

-- Update the existing instructions column with a default if empty
UPDATE organizations 
SET agent_instructions = 'You are a helpful booking assistant. Help customers find services and book appointments.'
WHERE agent_instructions IS NULL;
