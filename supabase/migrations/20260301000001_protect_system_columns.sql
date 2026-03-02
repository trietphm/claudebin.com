-- ABOUTME: Prevents authenticated users from directly modifying system-managed columns
-- ABOUTME: Uses current_user so SECURITY DEFINER functions naturally bypass this trigger

-- Shared trigger function: raises 42501 (insufficient_privilege) -> PostgREST returns HTTP 403
CREATE FUNCTION reject_system_column_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'permission denied: cannot modify system-managed columns'
    USING ERRCODE = '42501';
END;
$$ LANGUAGE plpgsql;

-- Sessions: protect viewCount, likeCount, isFeatured, status, storagePath, errorMessage, fileCount, messageCount
-- Allowed for authenticated clients: isPublic, title
CREATE TRIGGER protect_sessions_system_columns
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  WHEN (
    current_user = 'authenticated'
    AND (
      NEW."viewCount"    IS DISTINCT FROM OLD."viewCount"
      OR NEW."likeCount"    IS DISTINCT FROM OLD."likeCount"
      OR NEW."isFeatured"   IS DISTINCT FROM OLD."isFeatured"
      OR NEW.status          IS DISTINCT FROM OLD.status
      OR NEW."storagePath"   IS DISTINCT FROM OLD."storagePath"
      OR NEW."errorMessage"  IS DISTINCT FROM OLD."errorMessage"
      OR NEW."fileCount"     IS DISTINCT FROM OLD."fileCount"
      OR NEW."messageCount"  IS DISTINCT FROM OLD."messageCount"
    )
  )
  EXECUTE FUNCTION reject_system_column_update();

-- Profiles: protect viewCount, createdAt
-- Allowed for authenticated clients: deletedAt, username, name, avatarUrl
CREATE TRIGGER protect_profiles_system_columns
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (
    current_user = 'authenticated'
    AND (
      NEW."viewCount"  IS DISTINCT FROM OLD."viewCount"
      OR NEW."createdAt"  IS DISTINCT FROM OLD."createdAt"
    )
  )
  EXECUTE FUNCTION reject_system_column_update();
