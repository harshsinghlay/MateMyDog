-- Add ON DELETE CASCADE to all user-related foreign keys
ALTER TABLE pets
  DROP CONSTRAINT IF EXISTS pets_owner_id_fkey,
  ADD CONSTRAINT pets_owner_id_fkey
    FOREIGN KEY (owner_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

ALTER TABLE social_posts
  DROP CONSTRAINT IF EXISTS social_posts_user_id_fkey,
  ADD CONSTRAINT social_posts_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

ALTER TABLE post_likes
  DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey,
  ADD CONSTRAINT post_likes_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

ALTER TABLE post_comments
  DROP CONSTRAINT IF EXISTS post_comments_user_id_fkey,
  ADD CONSTRAINT post_comments_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);