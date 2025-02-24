-- Add unique constraint on auth.users email
ALTER TABLE auth.users
ADD CONSTRAINT users_email_key UNIQUE (email);

-- Create or replace the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if email already exists
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = NEW.email AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'User with this email already exists';
  END IF;

  -- Insert into profiles with error handling
  BEGIN
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
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'User with this email already exists';
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Error creating user profile: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the auth.users trigger to use the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();