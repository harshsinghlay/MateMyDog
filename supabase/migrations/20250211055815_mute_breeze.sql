-- Fix the foreign key reference in pet_social table
ALTER TABLE pet_social DROP CONSTRAINT IF EXISTS pet_social_user_id_fkey;
ALTER TABLE pet_social ADD CONSTRAINT pet_social_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create a function to get user details
CREATE OR REPLACE FUNCTION get_user_details(user_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'email', email,
    'user_metadata', raw_user_meta_data
  )
  FROM auth.users
  WHERE id = user_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_details TO authenticated;

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can view pet social interactions" ON pet_social;
DROP POLICY IF EXISTS "Authenticated users can create social interactions" ON pet_social;

CREATE POLICY "Anyone can view pet social interactions"
  ON pet_social FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create social interactions"
  ON pet_social FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    type IN ('like', 'review', 'comment') AND
    (
      (type = 'review' AND rating IS NOT NULL AND rating BETWEEN 1 AND 5) OR
      (type IN ('like', 'comment') AND rating IS NULL)
    )
  );