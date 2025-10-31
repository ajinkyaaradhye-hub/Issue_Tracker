# ---------- Build Stage ----------
FROM node:20-alpine AS builder  # Alpine for speed
WORKDIR /app

# Copy manifests FIRST
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/  # If shared

# Enable & install (full for build; --filter not needed here as we install all)
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
RUN pnpm install --frozen-lockfile

# Copy source AFTER install
COPY apps/backend ./apps/backend
COPY packages/shared-types ./packages/shared-types
COPY prisma ./prisma  # Root prisma? Or move to apps/backend/prisma

# Generate Prisma & build (from root context)
RUN pnpm --filter backend prisma:generate
RUN pnpm --filter backend build

# ---------- Runtime Stage (prod deps only) ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Copy ONLY runtime essentials (use pnpm deploy for optimization if needed)
COPY --from=builder /app/node_modules ./node_modules  # Full, but slim with --prod below
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/prisma ./prisma  # If schema here

# Re-install prod deps only (slims node_modules)
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

ENV NODE_ENV=production
EXPOSE 3000

# Run migrate + start (uncommented; use npx to avoid dep issues)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]