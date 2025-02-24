-- Drop existing email constraints
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE auth.users DROP CONSTRAINT IF EXISTS unique_email;

-- Add a new unique constraint with proper error handling
ALTER TABLE auth.users ADD CONSTRAINT users_email_unique_constraint UNIQUE (email);

-- Create a function to validate email before user creation
CREATE OR REPLACE FUNCTION auth.check_email_unique()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = NEW.email AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Email address % is already registered', NEW.email
      USING HINT = 'Please use a different email address',
            ERRCODE = 'unique_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to check email before insertion
DROP TRIGGER IF EXISTS check_email_unique_trigger ON auth.users;
CREATE TRIGGER check_email_unique_trigger
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.check_email_unique();

-- Update existing function to handle duplicate emails more gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Profile creation will only happen if email check passes
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
    RAISE EXCEPTION 'Error creating profile: Email % is already in use', NEW.email;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating user profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;