CREATE TABLE IF NOT EXISTS tool_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  tool_provider TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tool_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert tool logs for their tenant"
  ON tool_usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view tool logs for their tenant"
  ON tool_usage_logs
  FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_tool_usage_logs_tenant_id ON tool_usage_logs(tenant_id);
CREATE INDEX idx_tool_usage_logs_created_at ON tool_usage_logs(created_at DESC);
CREATE INDEX idx_tool_usage_logs_tool_name ON tool_usage_logs(tool_name);

CREATE OR REPLACE FUNCTION update_tool_usage_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tool_usage_logs_updated_at
  BEFORE UPDATE ON tool_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_usage_logs_updated_at();
