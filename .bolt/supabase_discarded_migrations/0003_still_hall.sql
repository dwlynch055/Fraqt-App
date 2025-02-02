/*
  # Add Pass Tables and Security Policies

  1. New Tables
    - pass_templates
      - id (uuid, primary key)
      - merchant_id (uuid, foreign key)
      - name (text)
      - description (text)
      - type (text)
      - style (jsonb)
      - nfc_enabled (boolean)
      - timestamps
    - passes
      - id (uuid, primary key)
      - template_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - merchant_id (uuid, foreign key)
      - status (text)
      - timestamps

  2. Security
    - Enable RLS on both tables
*/

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

-- Enable Row Level Security
ALTER TABLE pass_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE passes ENABLE ROW LEVEL SECURITY;