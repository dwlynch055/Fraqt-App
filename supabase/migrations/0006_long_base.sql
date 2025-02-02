/*
  # Fix Schema Issues

  1. Changes
    - Add key_prefix column to api_keys table
    - Fix merchant_users join query
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add key_prefix column to api_keys if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'api_keys' AND column_name = 'key_prefix'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN key_prefix text;
  END IF;
END $$;

-- Create index on key_prefix
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);

-- Update the merchant_users view to fix join syntax
CREATE OR REPLACE VIEW merchant_users_with_details AS
SELECT 
  mu.*,
  u.email,
  u.created_at as user_created_at
FROM merchant_users mu
JOIN auth.users u ON mu.user_id = u.id;

-- Grant access to the view
GRANT SELECT ON merchant_users_with_details TO authenticated;