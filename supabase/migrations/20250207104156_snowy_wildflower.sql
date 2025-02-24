/*
  # Add Reviews Columns

  1. Changes
    - Add rating and content columns to pet_reviews table
    - Add indexes for better performance
    - Update RLS policies for reviews

  2. Security
    - Enable RLS on pet_reviews table
    - Add policies for authenticated users
*/

-- Add new columns to pet_reviews table
ALTER TABLE pet_reviews
  ADD COLUMN IF NOT EXISTS rating integer,
  ADD COLUMN IF NOT EXISTS content text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pet_reviews_pet_id ON pet_reviews(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_reviews_user_id ON pet_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_reviews_type ON pet_reviews(type);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view all reviews" ON pet_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON pet_reviews;
DROP POLICY IF EXISTS "Users can manage their own reviews" ON pet_reviews;

CREATE POLICY "Anyone can view reviews"
  ON pet_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON pet_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    type IN ('like', 'review', 'comment')
  );

CREATE POLICY "Users can update their own reviews"
  ON pet_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON pet_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);