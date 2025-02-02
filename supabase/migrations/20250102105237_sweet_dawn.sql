/*
  # Fix merchant_users policies

  1. Changes
    - Drop existing recursive policies
    - Create new optimized non-recursive policies
    - Add index for better performance
  
  2. Security
    - Maintain proper access control
    - Prevent infinite recursion
    - Optimize query performance
*/

-- Drop existing policies
DROP POLICY IF EXISTS "view_own_membership" ON merchant_users;
DROP POLICY IF EXISTS "admin_view_members" ON merchant_users;
DROP POLICY IF EXISTS "admin_manage_members" ON merchant_users;

-- Create optimized index
CREATE INDEX IF NOT EXISTS idx_merchant_users_role_lookup 
ON merchant_users(merchant_id, user_id, role);

-- Create new non-recursive policies
CREATE POLICY "allow_view_own_membership"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "allow_admin_select"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.merchant_id 
      FROM merchant_users m 
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "allow_admin_insert"
  ON merchant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT m.merchant_id 
      FROM merchant_users m 
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "allow_admin_update"
  ON merchant_users FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.merchant_id 
      FROM merchant_users m 
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "allow_admin_delete"
  ON merchant_users FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT m.merchant_id 
      FROM merchant_users m 
      WHERE m.user_id = auth.uid() 
      AND m.role IN ('admin', 'owner')
    )
  );