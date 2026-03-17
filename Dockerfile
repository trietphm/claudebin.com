# syntax=docker/dockerfile:1

FROM oven/bun:1.3.5

WORKDIR /app

# Copy root package files
COPY package.json bun.lock ./

# Copy app package files
COPY app/package.json ./app/

# Install dependencies
RUN bun install --frozen-lockfile
WORKDIR /app/app
RUN bun install --frozen-lockfile

# Copy source files
WORKDIR /app
COPY app ./app
COPY biome.json ./

# Build the Next.js app
WORKDIR /app/app
ARG NEXT_PUBLIC_SUPABASE_URL=http://placeholder
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_DISABLE_STANDALONE=1
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN bun run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["bun", "run", "start"]
