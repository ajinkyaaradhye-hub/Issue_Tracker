# 1️⃣ Build Stage
FROM node:20-alpine AS builder  # Alpine for speed/size
WORKDIR /app

# Copy monorepo manifests FIRST (for caching)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared-types/package.json ./packages/shared-types/  # If using shared types

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate  # Match your root version

# Install deps (full, including dev for build)
RUN pnpm install --frozen-lockfile

# Copy source (after install for cache)
COPY apps/frontend ./apps/frontend
COPY packages/shared-types ./packages/shared-types  # Copy shared if needed

# Build (tsc + vite)
RUN pnpm --filter frontend build  # Assumes vite build runs tsc via script

# 2️⃣ Runtime Stage
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  # Add this if not already
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]