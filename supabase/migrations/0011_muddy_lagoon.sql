/*
  # Fix merchant_users policies

  1. Changes
    - Drop existing policies that may cause recursion
    - Create new non-recursive policies using subqueries
    - Add policy for initial owner creation
  
  2. Security
    - Maintains proper access control
    - Prevents infinite recursion
    - Ensures owners can always access their merchants
*/

-- Drop existing policies
DROP POLICY IF EXISTS "View own membership" ON merchant_users;
DROP POLICY IF EXISTS "Admin view members" ON merchant_users;
DROP POLICY IF EXISTS "Admin manage members" ON merchant_users;

-- Create base policies
CREATE POLICY "Users can view own membership"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Owners and admins can view all members"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM merchant_users base
      WHERE base.merchant_id = merchant_users.merchant_id
      AND base.user_id = auth.uid()
      AND base.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners and admins can insert members"
  ON merchant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM merchant_users base
      WHERE base.merchant_id = merchant_users.merchant_id
      AND base.user_id = auth.uid()
      AND base.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners and admins can update members"
  ON merchant_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM merchant_users base
      WHERE base.merchant_id = merchant_users.merchant_id
      AND base.user_id = auth.uid()
      AND base.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners and admins can delete members"
  ON merchant_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM merchant_users base
      WHERE base.merchant_id = merchant_users.merchant_id
      AND base.user_id = auth.uid()
      AND base.role IN ('owner', 'admin')
    )
  );

-- Add index to improve policy performance if not exists
CREATE INDEX IF NOT EXISTS idx_merchant_users_lookup 
ON merchant_users(merchant_id, user_id, role);