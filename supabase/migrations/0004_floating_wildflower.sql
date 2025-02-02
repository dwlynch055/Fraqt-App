/*
  # Fix API Keys Table

  1. Changes
    - Add trigger to automatically hash API keys before insertion
    - Add function to verify API keys
    - Add index on key_hash for faster lookups

  2. Security
    - Ensure API keys are properly hashed before storage
    - Add verification function for runtime checks
*/

-- Drop existing hash_api_key function if it exists
DROP FUNCTION IF EXISTS hash_api_key(text);

-- Create improved hash_api_key function
CREATE OR REPLACE FUNCTION hash_api_key(key text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN encode(digest(key, 'sha256'), 'hex');
END;
$$;

-- Create verify_api_key function
CREATE OR REPLACE FUNCTION verify_api_key(key text, hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN hash_api_key(key) = hash;
END;
$$;

-- Create trigger function for hashing keys
CREATE OR REPLACE FUNCTION hash_api_key_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Hash the key_hash field before storing
  NEW.key_hash := hash_api_key(NEW.key_hash);
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS hash_api_key_before_insert ON api_keys;
CREATE TRIGGER hash_api_key_before_insert
  BEFORE INSERT ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION hash_api_key_trigger();

-- Add index for key lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- Update RLS policies to be more specific
DROP POLICY IF EXISTS "Users can view their merchant's API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can create API keys for their merchant" ON api_keys;
DROP POLICY IF EXISTS "Users can delete their merchant's API keys" ON api_keys;

CREATE POLICY "Users can view their merchant's API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = api_keys.merchant_id
      AND merchant_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create API keys for their merchant"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = api_keys.merchant_id
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Users can delete their merchant's API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id = api_keys.merchant_id
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );