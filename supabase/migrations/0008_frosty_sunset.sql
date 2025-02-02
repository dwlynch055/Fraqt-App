/*
  # Add sidebar preference to profiles

  1. Changes
    - Add `sidebar_collapsed` column to profiles table with default value of false
*/

-- Add sidebar_collapsed column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'sidebar_collapsed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN sidebar_collapsed boolean DEFAULT false;
  END IF;
END $$;