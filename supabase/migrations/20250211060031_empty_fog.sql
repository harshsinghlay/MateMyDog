/*
  # Revert Social Schema Changes
  
  1. Changes
    - Drop pet_social table and dependencies
    - Restore social columns to pets table
    - Reset RLS policies
*/

-- Drop the pet_social table and its dependencies
DROP TABLE IF EXISTS pet_social CASCADE;
DROP FUNCTION IF EXISTS get_user_details CASCADE;

-- Restore social columns to pets table
ALTER TABLE pets 
  ADD COLUMN IF NOT EXISTS likes jsonb[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reviews jsonb[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS comments jsonb[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0;

-- Update RLS policies for pets table
DROP POLICY IF EXISTS "Anyone can view pets" ON pets;
DROP POLICY IF EXISTS "Users can update their own pets" ON pets;
DROP POLICY IF EXISTS "Users can delete their own pets" ON pets;
DROP POLICY IF EXISTS "Users can view all pets" ON pets;
DROP POLICY IF EXISTS "Users can manage their own pets" ON pets;

-- Recreate policies with new names to avoid conflicts
CREATE POLICY "pets_select_policy" 
  ON pets FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "pets_all_policy" 
  ON pets FOR ALL 
  TO authenticated 
  USING (auth.uid() = owner_id) 
  WITH CHECK (auth.uid() = owner_id);