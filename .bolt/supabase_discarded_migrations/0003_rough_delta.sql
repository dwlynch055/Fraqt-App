/*
  # Add merchant settings policies

  1. Changes
    - Add RLS policies for merchant_settings table
    - Policies control access based on user role and merchant association

  2. Security
    - Only authenticated users can access their merchant settings
    - Admin users can update settings for their merchants
*/

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'merchant_settings' 
    AND policyname = 'Users can view their merchant settings'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'merchant_settings' 
    AND policyname = 'Users can update their merchant settings if admin'
  ) THEN
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
  END IF;
END $$;