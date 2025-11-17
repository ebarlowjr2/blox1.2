
DROP POLICY IF EXISTS "Users can view members of their tenants" ON tenant_members;

CREATE POLICY "Users can view members of their tenants"
  ON tenant_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own membership"
  ON tenant_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create tenants"
  ON tenants FOR INSERT
  WITH CHECK (owner_user_id = auth.uid());

ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE tenant_members FORCE ROW LEVEL SECURITY;
ALTER TABLE agents FORCE ROW LEVEL SECURITY;
ALTER TABLE agent_tools FORCE ROW LEVEL SECURITY;
ALTER TABLE inbound_channels FORCE ROW LEVEL SECURITY;
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;
ALTER TABLE messages FORCE ROW LEVEL SECURITY;
ALTER TABLE activity_log FORCE ROW LEVEL SECURITY;
