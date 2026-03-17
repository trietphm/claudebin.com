-- ABOUTME: Fixes handle_new_user to schema-qualify generate_profile_username
-- ABOUTME: Required for auth.users trigger execution context during OAuth signup

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, "avatarUrl", username)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'name', ''),
      NULLIF(NEW.raw_user_meta_data->>'full_name', '')
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
      NULLIF(NEW.raw_user_meta_data->>'picture', '')
    ),
    public.generate_profile_username(NEW.id, NEW.email, NEW.raw_user_meta_data)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

UPDATE public.profiles AS profiles
SET username = public.generate_profile_username(
  auth_users.id,
  auth_users.email,
  auth_users.raw_user_meta_data
)
FROM auth.users AS auth_users
WHERE profiles.id = auth_users.id
  AND profiles.username IS NULL;
