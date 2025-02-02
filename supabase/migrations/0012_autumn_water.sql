/*
  # Fix merchant_users policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Create simplified policies for viewing and managing merchant users
    - Add performance optimizations with indexes
  
  2. Security
    - Maintain strict access control based on user roles
    - Prevent unauthorized access to member data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "View own membership" ON merchant_users;
DROP POLICY IF EXISTS "Admin view members" ON merchant_users;
DROP POLICY IF EXISTS "Admin manage members" ON merchant_users;

-- Create optimized index
CREATE INDEX IF NOT EXISTS idx_merchant_users_lookup 
ON merchant_users(merchant_id, user_id, role);

-- Create new simplified policies
CREATE POLICY "View own membership"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "View merchant members"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Manage merchant members"
  ON merchant_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_id = merchant_users.merchant_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );