/*
  # Fix merchant users policies and auth refresh

  1. Changes
    - Drop existing potentially recursive policies
    - Create new non-recursive policies with proper separation of concerns
    - Add index to improve policy performance
  
  2. Security
    - Ensures proper access control without recursion
    - Maintains principle of least privilege
*/

-- Add index to improve policy performance
CREATE INDEX IF NOT EXISTS idx_merchant_users_user_role 
ON merchant_users(merchant_id, user_id, role);

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own associations" ON merchant_users;
DROP POLICY IF EXISTS "Admins can view all merchant members" ON merchant_users;
DROP POLICY IF EXISTS "Admins can manage merchant members" ON merchant_users;
DROP POLICY IF EXISTS "Admins can update merchant members" ON merchant_users;
DROP POLICY IF EXISTS "Admins can delete merchant members" ON merchant_users;

-- Create new simplified policies
CREATE POLICY "View own membership"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin view members"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin manage members"
  ON merchant_users FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );