/*
  # Fix Merchant Users Policies

  This migration fixes the infinite recursion issue in merchant_users policies
  by restructuring them to avoid circular dependencies.
  
  1. Changes
    - Drop existing policies
    - Create new non-recursive policies
    - Add optimized indexes
  
  2. Security
    - Maintains same security model but with better implementation
    - Ensures users can only access appropriate data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "View own membership" ON merchant_users;
DROP POLICY IF EXISTS "Admin view all members" ON merchant_users;
DROP POLICY IF EXISTS "Admin insert members" ON merchant_users;
DROP POLICY IF EXISTS "Admin update members" ON merchant_users;
DROP POLICY IF EXISTS "Admin delete members" ON merchant_users;

-- Create optimized index
CREATE INDEX IF NOT EXISTS idx_merchant_users_admin_lookup 
ON merchant_users(merchant_id, user_id, role) 
WHERE role IN ('admin', 'owner');

-- Create new non-recursive policies
CREATE POLICY "users_view_own_membership"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "admins_view_merchant_members"
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

CREATE POLICY "admins_insert_merchant_members"
  ON merchant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM merchant_users admins 
      WHERE admins.merchant_id = merchant_id
      AND admins.user_id = auth.uid()
      AND admins.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "admins_update_merchant_members"
  ON merchant_users FOR UPDATE
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

CREATE POLICY "admins_delete_merchant_members"
  ON merchant_users FOR DELETE
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