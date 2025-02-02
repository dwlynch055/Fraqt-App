/*
  # Add Settings Schema

  1. New Tables
    - `merchant_settings`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, foreign key to merchants)
      - `integrations` (jsonb)
      - `notifications` (jsonb)
      - `security` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on merchant_settings table
    - Add policies for authenticated users to manage their own settings
*/

-- Create merchant_settings table
CREATE TABLE IF NOT EXISTS merchant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  integrations jsonb DEFAULT '{
    "pos": {"square": false, "shopify": false, "lightspeed": false, "toast": false, "clover": false},
    "ecommerce": {"shopify": false, "woocommerce": false, "magento": false, "bigcommerce": false},
    "crm": {"salesforce": false, "hubspot": false, "zoho": false, "dynamics": false},
    "loyalty": {"custom": false, "loyaltylion": false, "yotpo": false, "points": false},
    "mobile": {"ios": false, "android": false, "reactNative": false, "flutter": false},
    "inventory": {"custom": false, "tradegecko": false, "cin7": false, "brightpearl": false},
    "api": {"rest": false, "graphql": false, "webhooks": false, "rateLimiting": false}
  }'::jsonb,
  notifications jsonb DEFAULT '{
    "passActivations": false,
    "customerEngagement": false,
    "systemUpdates": false
  }'::jsonb,
  security jsonb DEFAULT '{
    "twoFactor": false,
    "apiKeyRotation": false,
    "sessionManagement": false
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id)
);

-- Enable Row Level Security
ALTER TABLE merchant_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their merchant settings"
  ON merchant_settings
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id 
      FROM merchant_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their merchant settings if admin"
  ON merchant_settings
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id 
      FROM merchant_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create function to update settings
CREATE OR REPLACE FUNCTION update_merchant_settings(
  merchant_id_param uuid,
  integrations_param jsonb DEFAULT NULL,
  notifications_param jsonb DEFAULT NULL,
  security_param jsonb DEFAULT NULL
)
RETURNS merchant_settings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result merchant_settings;
BEGIN
  INSERT INTO merchant_settings (
    merchant_id,
    integrations,
    notifications,
    security
  )
  VALUES (
    merchant_id_param,
    COALESCE(integrations_param, '{}'::jsonb),
    COALESCE(notifications_param, '{}'::jsonb),
    COALESCE(security_param, '{}'::jsonb)
  )
  ON CONFLICT (merchant_id) 
  DO UPDATE SET
    integrations = CASE 
      WHEN EXCLUDED.integrations IS NOT NULL 
      THEN EXCLUDED.integrations 
      ELSE merchant_settings.integrations 
    END,
    notifications = CASE 
      WHEN EXCLUDED.notifications IS NOT NULL 
      THEN EXCLUDED.notifications 
      ELSE merchant_settings.notifications 
    END,
    security = CASE 
      WHEN EXCLUDED.security IS NOT NULL 
      THEN EXCLUDED.security 
      ELSE merchant_settings.security 
    END,
    updated_at = now()
  RETURNING *
  INTO result;

  RETURN result;
END;
$$;