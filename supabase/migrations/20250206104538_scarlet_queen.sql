/*
  # Add Pet Schema Updates

  1. Changes
    - Add missing columns for pets table
    - Add proper data types and constraints
    - Add indexes for performance

  2. New Columns
    - microchip_id (text, optional)
    - media (jsonb array)
    - likes (jsonb array) 
    - reviews (jsonb array)
    - comments (jsonb array)
    - rating (numeric)

  3. Indexes
    - Add index on owner_id for faster lookups
    - Add index on created_at for sorting
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add microchip_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'microchip_id'
  ) THEN
    ALTER TABLE pets ADD COLUMN microchip_id text;
  END IF;

  -- Add media array if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'media'
  ) THEN
    ALTER TABLE pets ADD COLUMN media jsonb[] DEFAULT '{}';
  END IF;

  -- Add likes array if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'likes'
  ) THEN
    ALTER TABLE pets ADD COLUMN likes jsonb[] DEFAULT '{}';
  END IF;

  -- Add reviews array if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'reviews'
  ) THEN
    ALTER TABLE pets ADD COLUMN reviews jsonb[] DEFAULT '{}';
  END IF;

  -- Add comments array if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'comments'
  ) THEN
    ALTER TABLE pets ADD COLUMN comments jsonb[] DEFAULT '{}';
  END IF;

  -- Add rating if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'rating'
  ) THEN
    ALTER TABLE pets ADD COLUMN rating numeric(3,2) DEFAULT 0;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_pets_created_at ON pets(created_at);