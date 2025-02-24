/*
  # Update pets table schema

  1. Changes
    - Add missing columns for social features
    - Add JSON columns for complex data structures
    - Update RLS policies

  2. New Columns
    - `media` (jsonb array) - Store pet media items
    - `likes` (jsonb array) - Store pet likes
    - `reviews` (jsonb array) - Store pet reviews
    - `comments` (jsonb array) - Store pet comments
    - `rating` (numeric) - Average rating
*/

-- Add new columns to pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS media jsonb[] DEFAULT '{}';
ALTER TABLE pets ADD COLUMN IF NOT EXISTS likes jsonb[] DEFAULT '{}';
ALTER TABLE pets ADD COLUMN IF NOT EXISTS reviews jsonb[] DEFAULT '{}';
ALTER TABLE pets ADD COLUMN IF NOT EXISTS comments jsonb[] DEFAULT '{}';
ALTER TABLE pets ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0;

-- Update RLS policies
CREATE POLICY "Anyone can view pets"
  ON pets FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE
  USING (auth.uid() = owner_id);