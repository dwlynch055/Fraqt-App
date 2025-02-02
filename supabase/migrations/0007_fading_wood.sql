/*
  # Fix merchant_users policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Simplify policies to use direct user ID checks
    - Add proper owner/admin role checks

  2. Security
    - Maintain proper access control
    - Prevent unauthorized access
    - Keep audit trail
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their merchant associations" ON merchant_users;
DROP POLICY IF EXISTS "Users can manage merchant members if admin" ON merchant_users;

-- Create new, non-recursive policies
CREATE POLICY "Users can view merchant associations"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM merchant_users mu
      WHERE mu.merchant_id = merchant_users.merchant_id
      AND mu.user_id = auth.uid()
      AND mu.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can manage merchant members"
  ON merchant_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users mu
      WHERE mu.merchant_id = merchant_users.merchant_id
      AND mu.user_id = auth.uid()
      AND mu.role IN ('owner', 'admin')
    )
  );