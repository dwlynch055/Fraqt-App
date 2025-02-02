/*
  # Add Settings Tables

  1. New Tables
    - api_keys: Store API keys for merchant authentication
    - team_invitations: Manage team member invitations
    - billing_details: Store merchant billing information
    - security_settings: Configure security preferences
    - webhooks: Manage webhook endpoints
    - certificates: Store Apple Wallet certificates

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  last_used_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  permissions jsonb DEFAULT '[]'::jsonb
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  invited_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Billing details table
CREATE TABLE IF NOT EXISTS billing_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  payment_method jsonb,
  subscription_tier text,
  billing_cycle text,
  next_billing_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Security settings table
CREATE TABLE IF NOT EXISTS security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  two_factor_enabled boolean DEFAULT false,
  api_key_rotation_enabled boolean DEFAULT false,
  session_timeout_minutes integer DEFAULT 60,
  allowed_ip_addresses text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  url text NOT NULL,
  events text[] NOT NULL,
  secret_key text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  pass_type_id text NOT NULL,
  team_name text NOT NULL,
  certificate_data bytea NOT NULL,
  valid_until timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- API Keys Policies
CREATE POLICY "Users can view their merchant's API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Team Invitations Policies
CREATE POLICY "Users can view their merchant's invitations"
  ON team_invitations
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage invitations"
  ON team_invitations
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Billing Details Policies
CREATE POLICY "Users can view their merchant's billing details"
  ON billing_details
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage billing details"
  ON billing_details
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Security Settings Policies
CREATE POLICY "Users can view their merchant's security settings"
  ON security_settings
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage security settings"
  ON security_settings
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Webhooks Policies
CREATE POLICY "Users can view their merchant's webhooks"
  ON webhooks
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage webhooks"
  ON webhooks
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Certificates Policies
CREATE POLICY "Users can view their merchant's certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage certificates"
  ON certificates
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id FROM merchant_users
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );