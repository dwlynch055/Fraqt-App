/*
  # Settings Tables and Policies

  1. New Tables
    - api_keys
    - team_invitations
    - billing_details
    - security_settings
    - webhooks
    - certificates

  2. Security
    - Enable RLS on all tables
    - Add policies for user and admin access
*/

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  expires_at timestamptz
);

-- Team Invitations
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Billing Details
CREATE TABLE IF NOT EXISTS billing_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  stripe_customer_id text,
  plan text NOT NULL DEFAULT 'free',
  billing_email text,
  billing_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Security Settings
CREATE TABLE IF NOT EXISTS security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  two_factor_required boolean DEFAULT false,
  allowed_ips text[],
  session_duration interval DEFAULT '24 hours',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  url text NOT NULL,
  events text[] NOT NULL,
  secret text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  pass_type_id text NOT NULL,
  team_id text NOT NULL,
  certificate_data bytea NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies
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