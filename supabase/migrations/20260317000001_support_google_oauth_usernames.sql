-- ABOUTME: Makes profile creation provider-agnostic for Google and GitHub OAuth
-- ABOUTME: Generates unique usernames from provider metadata or email fallback

CREATE OR REPLACE FUNCTION generate_profile_username(
  p_user_id UUID,
  p_email TEXT,
  p_metadata JSONB
)
RETURNS TEXT AS $$
DECLARE
  username_seed TEXT;
  username_base TEXT;
  username_candidate TEXT;
  user_id_suffix TEXT;
BEGIN
  username_seed := COALESCE(
    NULLIF(p_metadata->>'user_name', ''),
    NULLIF(p_metadata->>'preferred_username', ''),
    NULLIF(p_metadata->>'full_name', ''),
    NULLIF(p_metadata->>'name', ''),
    NULLIF(split_part(COALESCE(p_email, ''), '@', 1), ''),
    'user'
  );

  username_base := lower(username_seed);
  username_base := regexp_replace(username_base, '[^a-z0-9]+', '-', 'g');
  username_base := regexp_replace(username_base, '^-+|-+$', '', 'g');

  IF username_base = '' THEN
    username_base := 'user';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE username = username_base
      AND id <> p_user_id
  ) THEN
    RETURN username_base;
  END IF;

  user_id_suffix := left(replace(p_user_id::TEXT, '-', ''), 8);
  username_candidate := username_base || '-' || user_id_suffix;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE username = username_candidate
      AND id <> p_user_id
  ) THEN
    RETURN username_candidate;
  END IF;

  RETURN username_base || '-' || replace(p_user_id::TEXT, '-', '');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
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
