/*
  # Add API Keys Table

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `name` (text)
      - `key_hash` (text)
      - `key_prefix` (text)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz)
      - `expires_at` (timestamptz)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policies for authenticated users to manage their merchant's API keys
*/

-- Create API keys table with proper structure
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  expires_at timestamptz,
  UNIQUE(key_prefix)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their merchant's API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id 
      FROM merchant_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create API keys for their merchant"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT merchant_id 
      FROM merchant_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their merchant's API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id 
      FROM merchant_users 
      WHERE user_id = auth.uid()
    )
  );

-- Create function to hash API keys
CREATE OR REPLACE FUNCTION hash_api_key(key text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(digest(key, 'sha256'), 'hex');
END;
$$;