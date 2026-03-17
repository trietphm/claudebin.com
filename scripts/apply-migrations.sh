#!/bin/sh
set -eu

DB_HOST="${POSTGRES_HOST:-db}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-postgres}"
DB_USER="${POSTGRES_USER:-postgres}"
MIGRATIONS_DIR="${MIGRATIONS_DIR:-/workspace/supabase/migrations}"

echo "Waiting for database at ${DB_HOST}:${DB_PORT}/${DB_NAME}..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
  sleep 1
done

echo "Ensuring migration tracking table exists..."
psql \
  "postgresql://${DB_USER}:${PGPASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}" \
  -v ON_ERROR_STOP=1 \
  -c "CREATE TABLE IF NOT EXISTS public.schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());"

for file in "${MIGRATIONS_DIR}"/*.sql; do
  [ -f "$file" ] || continue

  version="$(basename "$file" .sql)"
  applied="$(psql \
    "postgresql://${DB_USER}:${PGPASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}" \
    -tA \
    -c "SELECT 1 FROM public.schema_migrations WHERE version = '${version}' LIMIT 1;")"

  if [ "$applied" = "1" ]; then
    echo "Skipping already applied migration: ${version}"
    continue
  fi

  echo "Applying migration: ${version}"
  psql \
    "postgresql://${DB_USER}:${PGPASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}" \
    -v ON_ERROR_STOP=1 \
    -f "$file"

  psql \
    "postgresql://${DB_USER}:${PGPASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}" \
    -v ON_ERROR_STOP=1 \
    -c "INSERT INTO public.schema_migrations (version) VALUES ('${version}');"
done

echo "Migrations complete."
