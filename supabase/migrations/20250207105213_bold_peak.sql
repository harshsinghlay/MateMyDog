-- Add likes_count column to pet_reviews table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pet_reviews' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE pet_reviews ADD COLUMN likes_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pet_reviews' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE pet_reviews ADD COLUMN parent_id uuid REFERENCES pet_reviews(id);
  END IF;
END $$;

-- Drop existing triggers and function if they exist
DROP TRIGGER IF EXISTS update_review_likes_count_on_insert ON pet_reviews;
DROP TRIGGER IF EXISTS update_review_likes_count_on_delete ON pet_reviews;
DROP FUNCTION IF EXISTS update_review_likes_count();

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_review_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.type = 'like' THEN
    -- Increment likes count
    UPDATE pet_reviews
    SET likes_count = likes_count + 1
    WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.type = 'like' THEN
    -- Decrement likes count
    UPDATE pet_reviews
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.parent_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create separate triggers for INSERT and DELETE
CREATE TRIGGER update_review_likes_count_on_insert
AFTER INSERT ON pet_reviews
FOR EACH ROW
WHEN (NEW.type = 'like')
EXECUTE FUNCTION update_review_likes_count();

CREATE TRIGGER update_review_likes_count_on_delete
AFTER DELETE ON pet_reviews
FOR EACH ROW
WHEN (OLD.type = 'like')
EXECUTE FUNCTION update_review_likes_count();