/*
  # Fix Settings Tables and Policies

  1. Drop existing policies and tables
  2. Recreate tables with proper structure
  3. Enable RLS
  4. Add new policies
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- API Keys policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'api_keys' 
    AND policyname = 'Users can view their merchant''s API keys'
  ) THEN
    DROP POLICY "Users can view their merchant's API keys" ON api_keys;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'api_keys' 
    AND policyname = 'Admins can manage API keys'
  ) THEN
    DROP POLICY "Admins can manage API keys" ON api_keys;
  END IF;

  -- Team invitations policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'team_invitations' 
    AND policyname = 'Users can view their merchant''s invitations'
  ) THEN
    DROP POLICY "Users can view their merchant's invitations" ON team_invitations;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'team_invitations' 
    AND policyname = 'Admins can manage invitations'
  ) THEN
    DROP POLICY "Admins can manage invitations" ON team_invitations;
  END IF;

  -- Drop other existing policies similarly
END $$;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS webhooks;
DROP TABLE IF EXISTS security_settings;
DROP TABLE IF EXISTS billing_details;
DROP TABLE IF EXISTS team_invitations;
DROP TABLE IF EXISTS api_keys;

-- Create tables
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  expires_at timestamptz
);

CREATE TABLE team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE billing_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  stripe_customer_id text,
  plan text NOT NULL DEFAULT 'free',
  billing_email text,
  billing_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  two_factor_required boolean DEFAULT false,
  allowed_ips text[],
  session_duration interval DEFAULT '24 hours',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  url text NOT NULL,
  events text[] NOT NULL,
  secret text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE certificates (
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

-- Create new policies
CREATE POLICY "view_api_keys" ON api_keys
  FOR SELECT TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "manage_api_keys" ON api_keys
  FOR ALL TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "view_invitations" ON team_invitations
  FOR SELECT TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "manage_invitations" ON team_invitations
  FOR ALL TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "view_billing" ON billing_details
  FOR SELECT TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "manage_billing" ON billing_details
  FOR ALL TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "view_security" ON security_settings
  FOR SELECT TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "manage_security" ON security_settings
  FOR ALL TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "view_webhooks" ON webhooks
  FOR SELECT TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "manage_webhooks" ON webhooks
  FOR ALL TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "view_certificates" ON certificates
  FOR SELECT TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "manage_certificates" ON certificates
  FOR ALL TO authenticated
  USING (merchant_id IN (
    SELECT merchant_id FROM merchant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  ));