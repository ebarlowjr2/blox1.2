-- Migration: Create tool_invocations table for logging agent tool usage
-- Run this in your Supabase SQL Editor

-- Create the tool_invocations table
CREATE TABLE IF NOT EXISTS tool_invocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  agent_name TEXT NOT NULL,
  tool_key TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  result JSONB NOT NULL DEFAULT '{}',
  run_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tool_invocations_tenant_id ON tool_invocations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tool_invocations_created_at ON tool_invocations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_invocations_run_id ON tool_invocations(run_id) WHERE run_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tool_invocations_agent_name ON tool_invocations(agent_name);
CREATE INDEX IF NOT EXISTS idx_tool_invocations_tool_key ON tool_invocations(tool_key);

-- Enable Row Level Security
ALTER TABLE tool_invocations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own tenant's invocations
-- For now, tenant_id equals user_id (single-user tenants)
-- This can be updated later for multi-user organizations
CREATE POLICY "Users can view their tenant invocations"
  ON tool_invocations
  FOR SELECT
  USING (tenant_id = auth.uid());

-- Policy: Service role can insert (for API routes using service key)
CREATE POLICY "Service role can insert invocations"
  ON tool_invocations
  FOR INSERT
  WITH CHECK (true);

-- Policy: Service role can update (for error handling)
CREATE POLICY "Service role can update invocations"
  ON tool_invocations
  FOR UPDATE
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE tool_invocations IS 'Audit log of all tool invocations by AI agents per tenant';
COMMENT ON COLUMN tool_invocations.tenant_id IS 'The tenant/workspace this invocation belongs to (currently equals user_id)';
COMMENT ON COLUMN tool_invocations.agent_name IS 'Name of the AI agent that invoked the tool (e.g., BLOX, M.A.R.K)';
COMMENT ON COLUMN tool_invocations.tool_key IS 'Identifier for the tool used (e.g., email, sms, task)';
COMMENT ON COLUMN tool_invocations.payload IS 'Input parameters for the tool (sensitive data should be redacted)';
COMMENT ON COLUMN tool_invocations.result IS 'Result of the tool invocation including status and any metadata';
COMMENT ON COLUMN tool_invocations.run_id IS 'Optional correlation ID to group invocations from a single crew run';
