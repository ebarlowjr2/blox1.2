
CREATE POLICY "Owners can view their tenants"
  ON tenants FOR SELECT
  USING (owner_user_id = auth.uid());
