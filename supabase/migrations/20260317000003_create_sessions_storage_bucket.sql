-- ABOUTME: Creates the private storage bucket used for raw session JSONL uploads
-- ABOUTME: Required for self-hosted Docker setups where storage buckets are not pre-provisioned

INSERT INTO storage.buckets (id, name, public)
VALUES ('sessions', 'sessions', false)
ON CONFLICT (id) DO NOTHING;
