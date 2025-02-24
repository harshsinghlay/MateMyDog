-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view posts" ON social_posts;
DROP POLICY IF EXISTS "Users can create posts" ON social_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON social_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON social_posts;

-- Create updated policies for social_posts
CREATE POLICY "Anyone can view posts"
  ON social_posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON social_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM pets
      WHERE id = pet_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own posts"
  ON social_posts FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM pets
      WHERE id = pet_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own posts"
  ON social_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update socialService to include user_id in post creation
ALTER TABLE social_posts 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN pet_id SET NOT NULL,
  ALTER COLUMN image_url SET NOT NULL;

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id_pet_id ON social_posts(user_id, pet_id);

-- Update post_likes policies
DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;
DROP POLICY IF EXISTS "Users can like posts" ON post_likes;
DROP POLICY IF EXISTS "Users can unlike posts" ON post_likes;

CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage likes"
  ON post_likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update post_comments policies
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;

CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can manage comments"
  ON post_comments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);