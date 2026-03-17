# Google OAuth Setup for Local Docker Compose

This guide is for the current self-hosted stack in [docker-compose.yml](../docker-compose.yml), which includes the upstream Supabase Docker services from `supabase-docker/docker/docker-compose.yml`.

The important detail is:

- Google and GitHub redirect to Supabase Auth first
- Supabase Auth then redirects back to this app at `/auth/callback`

That means your OAuth providers must use:

```text
http://localhost:8000/auth/v1/callback
```

Not:

```text
http://localhost:3000/auth/callback
```

## 1. Prepare the local Supabase files

If you have not already done this:

```bash
./scripts/docker-setup.sh
```

This creates:

- [supabase-docker/](../supabase-docker/)
- [.env](../.env)

## 2. Create a Google OAuth app

In Google Cloud Console:

1. Create or select a project.
2. Open `APIs & Services -> Credentials`.
3. Create an `OAuth client ID`.
4. Choose `Web application`.
5. Add this Authorized redirect URI:

```text
http://localhost:8000/auth/v1/callback
```

Copy the resulting:

- Google Client ID
- Google Client Secret

## 3. Create a GitHub OAuth app

In GitHub:

1. Go to `Settings -> Developer settings -> OAuth Apps`.
2. Create a new OAuth app.
3. Set Homepage URL to:

```text
http://localhost:3000
```

4. Set Authorization callback URL to:

```text
http://localhost:8000/auth/v1/callback
```

Copy the resulting:

- GitHub Client ID
- GitHub Client Secret

## 4. Update the root `.env`

Edit [.env](../.env) and set these values:

```env
SITE_URL=http://localhost:3000
API_EXTERNAL_URL=http://localhost:8000
ADDITIONAL_REDIRECT_URLS=http://localhost:3000/auth/callback

GOOGLE_ENABLED=true
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

GITHUB_ENABLED=true
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

Notes:

- `SITE_URL` is the app URL users land on after auth.
- `API_EXTERNAL_URL` is the public Supabase API URL exposed by Kong.
- `ADDITIONAL_REDIRECT_URLS` must include the app callback route because Supabase redirects there after the provider callback finishes.

## 5. Enable the providers in Supabase Auth compose config

Edit [supabase-docker/docker/docker-compose.yml](../supabase-docker/docker/docker-compose.yml).

Under the `auth` service, uncomment these lines:

```yaml
GOTRUE_EXTERNAL_GOOGLE_ENABLED: ${GOOGLE_ENABLED}
GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
GOTRUE_EXTERNAL_GOOGLE_SECRET: ${GOOGLE_SECRET}
GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI: ${API_EXTERNAL_URL}/auth/v1/callback

GOTRUE_EXTERNAL_GITHUB_ENABLED: ${GITHUB_ENABLED}
GOTRUE_EXTERNAL_GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
GOTRUE_EXTERNAL_GITHUB_SECRET: ${GITHUB_SECRET}
GOTRUE_EXTERNAL_GITHUB_REDIRECT_URI: ${API_EXTERNAL_URL}/auth/v1/callback
```

If these stay commented out, `.env` alone will not enable OAuth.

## 6. Start the stack

Run:

```bash
docker compose up --build
```

Use `--build` because the app container is built from [Dockerfile](../Dockerfile), and the image needs to include your latest app code.

Expected services:

- App: `http://localhost:3000`
- Supabase API: `http://localhost:8000`
- Supabase Studio: `http://localhost:3001`

The `migrations` service will automatically apply SQL files from [supabase/migrations](../supabase/migrations), including the Google/GitHub username generation migration.

## 7. Verify the login flow

Open:

```text
http://localhost:3000/auth/login
```

You should see:

- `Continue with Google`
- `Continue with GitHub`

Test both:

1. Click Google.
2. Complete the provider login.
3. Confirm you return to `http://localhost:3000`.
4. Confirm the header shows your signed-in identity.
5. Confirm your profile page opens correctly.

Repeat the same for GitHub.

## 8. Verify profile creation

After signing in, open Supabase Studio at:

```text
http://localhost:3001
```

Check the `profiles` table:

- `name` should be populated from provider metadata when available
- `avatarUrl` should be populated from `avatar_url` or `picture`
- `username` should exist for both Google and GitHub users

For Google users, `username` is auto-generated when the provider does not supply a GitHub-style handle.

## Troubleshooting

### Login button redirects but provider errors immediately

Usually means the provider callback URL is wrong.

Use:

```text
http://localhost:8000/auth/v1/callback
```

### Provider login succeeds but app returns to an auth error page

Check:

- `SITE_URL=http://localhost:3000`
- `API_EXTERNAL_URL=http://localhost:8000`
- `ADDITIONAL_REDIRECT_URLS=http://localhost:3000/auth/callback`

### OAuth providers do not appear to work at all

Check that the `GOTRUE_EXTERNAL_*` lines were uncommented in [supabase-docker/docker/docker-compose.yml](../supabase-docker/docker/docker-compose.yml).

### Changes do not show up after editing config

Restart with a rebuild:

```bash
docker compose down
docker compose up --build
```
