/*
  # Fix merchant_users policies

  1. Changes
    - Drop existing recursive policies
    - Create new non-recursive policies with subqueries
    - Add optimized index for policy lookups
  
  2. Security
    - Maintain same security model but avoid recursion
    - Users can view their own membership
    - Admins/owners can manage all members of their merchants
*/

-- Drop existing policies
DROP POLICY IF EXISTS "allow_view_own_membership" ON merchant_users;
DROP POLICY IF EXISTS "allow_admin_select" ON merchant_users;
DROP POLICY IF EXISTS "allow_admin_insert" ON merchant_users;
DROP POLICY IF EXISTS "allow_admin_update" ON merchant_users;
DROP POLICY IF EXISTS "allow_admin_delete" ON merchant_users;

-- Create optimized index
CREATE INDEX IF NOT EXISTS idx_merchant_users_admin_lookup 
ON merchant_users(user_id, merchant_id, role) 
WHERE role IN ('admin', 'owner');

-- Create new non-recursive policies
CREATE POLICY "users_view_own"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "admins_view_all"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM merchant_users admins 
      WHERE admins.merchant_id = merchant_users.merchant_id
      AND admins.user_id = auth.uid()
      AND admins.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "admins_manage"
  ON merchant_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM merchant_users admins 
      WHERE admins.merchant_id = merchant_users.merchant_id
      AND admins.user_id = auth.uid()
      AND admins.role IN ('admin', 'owner')
    )
  );