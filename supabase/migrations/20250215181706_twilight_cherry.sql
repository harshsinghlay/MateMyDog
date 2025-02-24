-- First, drop the existing unique constraint if it exists
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS users_email_key;

-- Add a new unique constraint with proper error handling
ALTER TABLE auth.users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Update the handle_new_user function to handle duplicate emails gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  existing_user auth.users%ROWTYPE;
BEGIN
  -- Check for existing user with the same email
  SELECT * INTO existing_user
  FROM auth.users
  WHERE email = NEW.email AND id != NEW.id;

  IF FOUND THEN
    RAISE EXCEPTION 'User with email % already exists', NEW.email
      USING HINT = 'Please use a different email address',
            ERRCODE = 'unique_violation';
  END IF;

  -- Insert into profiles
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    address
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    jsonb_build_object(
      'city', '',
      'state', '',
      'country', '',
      'postalCode', ''
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Email address % is already in use', NEW.email
      USING HINT = 'Please use a different email address',
            ERRCODE = 'unique_violation';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating user profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;