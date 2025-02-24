/*
  # Fix column names in pets table

  1. Changes
    - Rename columns to follow PostgreSQL naming conventions (snake_case)
    - Add missing columns
    - Ensure all required fields are present

  2. New/Updated Columns
    - `date_of_birth` (date)
    - `image_url` (text)
    - `owner_name` (text)
    - `location` (jsonb)
*/

-- Add missing columns and rename existing ones to follow conventions
ALTER TABLE pets 
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS owner_name text,
  ADD COLUMN IF NOT EXISTS location jsonb DEFAULT '{}';

-- Ensure all required columns exist with correct types
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'name') THEN
    ALTER TABLE pets ADD COLUMN name text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'breed') THEN
    ALTER TABLE pets ADD COLUMN breed text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'age') THEN
    ALTER TABLE pets ADD COLUMN age integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'gender') THEN
    ALTER TABLE pets ADD COLUMN gender text NOT NULL DEFAULT 'male';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'weight') THEN
    ALTER TABLE pets ADD COLUMN weight numeric(5,2);
  END IF;
END $$;