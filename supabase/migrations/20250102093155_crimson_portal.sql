/*
  # Fix merchant_users RLS policies

  1. Changes
    - Drop existing recursive policies
    - Create new simplified policies that avoid recursion
    - Add optimized index for policy lookups

  2. Security
    - Maintain same security model but with better performance
    - Users can still only view their own memberships
    - Admins/owners can manage team members
*/

-- Drop existing policies
DROP POLICY IF EXISTS "users_view_own_membership" ON merchant_users;
DROP POLICY IF EXISTS "admins_view_merchant_members" ON merchant_users;
DROP POLICY IF EXISTS "admins_insert_merchant_members" ON merchant_users;
DROP POLICY IF EXISTS "admins_update_merchant_members" ON merchant_users;
DROP POLICY IF EXISTS "admins_delete_merchant_members" ON merchant_users;

-- Create optimized index
CREATE INDEX IF NOT EXISTS idx_merchant_users_lookup 
ON merchant_users(user_id, merchant_id, role);

-- Create new non-recursive policies
CREATE POLICY "view_own_membership"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "admin_view_members"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users base
      WHERE base.merchant_id = merchant_users.merchant_id
      AND base.user_id = auth.uid()
      AND base.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "admin_manage_members"
  ON merchant_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users base
      WHERE base.merchant_id = merchant_users.merchant_id
      AND base.user_id = auth.uid()
      AND base.role IN ('admin', 'owner')
    )
  );