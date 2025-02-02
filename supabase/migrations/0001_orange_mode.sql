/*
  # Initial Schema Setup

  1. Tables
    - merchants
    - merchant_users
    - pass_templates
    - passes
    - api_keys
    - team_invitations
    - billing_details
    - security_settings
    - webhooks
    - certificates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create base merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create merchant_users association table
CREATE TABLE IF NOT EXISTS merchant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, user_id)
);

-- Create pass_templates table
CREATE TABLE IF NOT EXISTS pass_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL,
  style jsonb NOT NULL DEFAULT '{}'::jsonb,
  nfc_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create passes table
CREATE TABLE IF NOT EXISTS passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES pass_templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create api_keys table
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

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create billing_details table
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

-- Create security_settings table
CREATE TABLE IF NOT EXISTS security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  two_factor_required boolean DEFAULT false,
  allowed_ips text[],
  session_duration interval DEFAULT '24 hours',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create webhooks table
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

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  pass_type_id text NOT NULL,
  team_id text NOT NULL,
  certificate_data bytea NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pass_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their merchant associations"
  ON merchant_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage merchant members if admin"
  ON merchant_users FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM merchant_users 
      WHERE merchant_id = merchant_users.merchant_id 
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their merchant's passes"
  ON passes FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id 
      FROM merchant_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage passes if admin"
  ON passes FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchant_id 
      FROM merchant_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create analytics function
CREATE OR REPLACE FUNCTION get_merchant_analytics(merchant_id_param uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_passes integer;
  active_passes integer;
  scans_last_week integer;
  customer_engagement numeric;
BEGIN
  -- Get total passes
  SELECT COUNT(*) INTO total_passes
  FROM passes
  WHERE merchant_id = merchant_id_param;

  -- Get active passes
  SELECT COUNT(*) INTO active_passes
  FROM passes
  WHERE merchant_id = merchant_id_param
  AND status = 'active';

  -- Calculate customer engagement (active/total ratio)
  IF total_passes > 0 THEN
    customer_engagement := (active_passes::numeric / total_passes::numeric) * 100;
  ELSE
    customer_engagement := 0;
  END IF;

  RETURN json_build_object(
    'totalPasses', total_passes,
    'activePasses', active_passes,
    'scansLastWeek', 0,
    'customerEngagement', customer_engagement
  );
END;
$$;