/*
  # Add pet_social table and update pets table

  1. New Tables
    - `pet_social` - Stores social interactions for pets
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `type` (text) - 'like', 'review', or 'comment'
      - `user_id` (uuid, references auth.users)
      - `content` (text) - For reviews and comments
      - `rating` (integer) - For reviews
      - `created_at` (timestamptz)

  2. Changes
    - Remove social columns from pets table
    - Add owner_name column to pets table
*/

-- Create pet_social table
CREATE TABLE IF NOT EXISTS pet_social (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'review', 'comment')),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_pet_social_pet_id ON pet_social(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_social_user_id ON pet_social(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_social_type ON pet_social(type);

-- Enable RLS
ALTER TABLE pet_social ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view pet social interactions"
  ON pet_social FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create social interactions"
  ON pet_social FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social interactions"
  ON pet_social FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social interactions"
  ON pet_social FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Remove social columns from pets table
ALTER TABLE pets 
  DROP COLUMN IF EXISTS likes,
  DROP COLUMN IF EXISTS reviews,
  DROP COLUMN IF EXISTS comments,
  DROP COLUMN IF EXISTS rating;

-- Add owner_name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'owner_name'
  ) THEN
    ALTER TABLE pets ADD COLUMN owner_name text;
  END IF;
END $$;