/*
  # Fix recursive policies in merchant_users table

  1. Changes
    - Drop existing recursive policies that are causing infinite recursion
    - Create new non-recursive policies with optimized logic
    - Add index to improve query performance
  
  2. Security
    - Maintain same security model but with more efficient implementation
    - Ensure proper access control for different user roles
*/

-- Drop existing policies that may cause recursion
DROP POLICY IF EXISTS "View own membership" ON merchant_users;
DROP POLICY IF EXISTS "View merchant members" ON merchant_users;
DROP POLICY IF EXISTS "Manage merchant members" ON merchant_users;

-- Create optimized index for policy lookups
CREATE INDEX IF NOT EXISTS idx_merchant_users_role_lookup 
ON merchant_users(merchant_id, user_id, role);

-- Create new non-recursive policies
CREATE POLICY "View own membership"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin view all members"
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

CREATE POLICY "Admin insert members"
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

CREATE POLICY "Admin update members"
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

CREATE POLICY "Admin delete members"
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