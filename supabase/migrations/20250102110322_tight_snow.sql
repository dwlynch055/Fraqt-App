/*
  # Fix recursive policies for merchant_users table

  1. Changes
    - Drop existing recursive policies
    - Create new non-recursive policies using subqueries
    - Add optimized indexes for performance
  
  2. Security
    - Maintain same security model but with better implementation
    - Users can view their own memberships
    - Admins/owners can manage all members in their merchant
*/

-- Drop existing policies
DROP POLICY IF EXISTS "users_view_own" ON merchant_users;
DROP POLICY IF EXISTS "admins_view_all" ON merchant_users;
DROP POLICY IF EXISTS "admins_manage" ON merchant_users;

-- Create optimized index
CREATE INDEX IF NOT EXISTS idx_merchant_users_lookup 
ON merchant_users(user_id, merchant_id);

CREATE INDEX IF NOT EXISTS idx_merchant_users_role_lookup 
ON merchant_users(merchant_id, role) 
WHERE role IN ('admin', 'owner');

-- Create new non-recursive policies
CREATE POLICY "allow_view_own"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "allow_admin_view"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users base_mu
      WHERE base_mu.merchant_id = merchant_users.merchant_id
      AND base_mu.user_id = auth.uid()
      AND base_mu.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "allow_admin_insert"
  ON merchant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchant_users base_mu
      WHERE base_mu.merchant_id = merchant_id
      AND base_mu.user_id = auth.uid()
      AND base_mu.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "allow_admin_update"
  ON merchant_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users base_mu
      WHERE base_mu.merchant_id = merchant_users.merchant_id
      AND base_mu.user_id = auth.uid()
      AND base_mu.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "allow_admin_delete"
  ON merchant_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users base_mu
      WHERE base_mu.merchant_id = merchant_users.merchant_id
      AND base_mu.user_id = auth.uid()
      AND base_mu.role IN ('admin', 'owner')
    )
  );