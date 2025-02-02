/*
  # Fix merchant users policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Create new non-recursive policies for merchant_users table
    - Add proper role-based access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view merchant associations" ON merchant_users;
DROP POLICY IF EXISTS "Admins can manage merchant members" ON merchant_users;
DROP POLICY IF EXISTS "Users can view their merchant associations" ON merchant_users;
DROP POLICY IF EXISTS "Users can manage merchant members if admin" ON merchant_users;

-- Create new non-recursive policies
CREATE POLICY "Users can view own associations"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all merchant members"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users mu
      WHERE mu.merchant_id = merchant_users.merchant_id
      AND mu.user_id = auth.uid()
      AND mu.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can manage merchant members"
  ON merchant_users 
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchant_users mu
      WHERE mu.merchant_id = merchant_users.merchant_id
      AND mu.user_id = auth.uid()
      AND mu.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update merchant members"
  ON merchant_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users mu
      WHERE mu.merchant_id = merchant_users.merchant_id
      AND mu.user_id = auth.uid()
      AND mu.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete merchant members"
  ON merchant_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users mu
      WHERE mu.merchant_id = merchant_users.merchant_id
      AND mu.user_id = auth.uid()
      AND mu.role IN ('owner', 'admin')
    )
  );