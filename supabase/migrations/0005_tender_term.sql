/*
  # Add Storage Configuration

  1. New Buckets
    - profile-images: For user profile pictures
    - pass-assets: For pass-related files (logos, backgrounds)
    - certificates: For Apple Wallet certificates

  2. Security
    - Enable RLS on all buckets
    - Add policies for secure access
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-images', 'Profile Images', false),
  ('pass-assets', 'Pass Assets', false),
  ('certificates', 'Certificates', false)
ON CONFLICT (id) DO NOTHING;

-- Profile Images policies
CREATE POLICY "Users can view own profile image"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'profile-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload own profile image"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own profile image"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile image"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Pass Assets policies
CREATE POLICY "Users can view merchant pass assets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'pass-assets' AND 
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id::text = (storage.foldername(name))[1]
      AND merchant_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload merchant pass assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pass-assets' AND 
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id::text = (storage.foldername(name))[1]
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Users can update merchant pass assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'pass-assets' AND 
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id::text = (storage.foldername(name))[1]
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Users can delete merchant pass assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pass-assets' AND 
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id::text = (storage.foldername(name))[1]
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );

-- Certificates policies
CREATE POLICY "Users can view merchant certificates"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'certificates' AND 
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id::text = (storage.foldername(name))[1]
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Users can upload merchant certificates"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'certificates' AND 
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id::text = (storage.foldername(name))[1]
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Users can delete merchant certificates"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'certificates' AND 
    EXISTS (
      SELECT 1 FROM merchant_users
      WHERE merchant_users.merchant_id::text = (storage.foldername(name))[1]
      AND merchant_users.user_id = auth.uid()
      AND merchant_users.role IN ('admin', 'owner')
    )
  );