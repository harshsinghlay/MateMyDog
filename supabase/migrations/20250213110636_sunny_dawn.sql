-- Drop existing comment policies
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
DROP POLICY IF EXISTS "Users can manage comments" ON post_comments;

-- Add user_metadata column to post_comments
ALTER TABLE post_comments
  ADD COLUMN IF NOT EXISTS user_metadata jsonb DEFAULT '{}';

-- Create function to get user metadata
CREATE OR REPLACE FUNCTION get_user_metadata(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data
    FROM auth.users
    WHERE id = user_id
  );
END;
$$;

-- Create trigger to automatically set user metadata
CREATE OR REPLACE FUNCTION set_comment_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_metadata = get_user_metadata(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_comment_user_metadata_trigger ON post_comments;
CREATE TRIGGER set_comment_user_metadata_trigger
  BEFORE INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION set_comment_user_metadata();

-- Recreate policies
CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can manage comments"
  ON post_comments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);