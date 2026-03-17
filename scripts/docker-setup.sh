#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "=== Claudebin Docker Setup ==="
echo

# Clone Supabase if needed
if [ ! -d "supabase-docker" ]; then
    echo "Cloning Supabase docker setup..."
    git clone --depth 1 https://github.com/supabase/supabase supabase-docker
else
    echo "Supabase docker already exists."
fi

# Copy env file if needed
if [ ! -f ".env" ]; then
    echo "Copying .env.example..."
    cp supabase-docker/docker/.env.example .env
    echo
    echo "Created .env file with default values."
    echo "For production, edit .env and update secrets."
fi

echo
echo "=== Setup complete! ==="
echo
echo "Start services:"
echo "  docker compose up -d"
echo
echo "Services:"
echo "  - App:            http://localhost:3000"
echo "  - Supabase API:   http://localhost:8000"
echo "  - Supabase Studio: http://localhost:3001"
