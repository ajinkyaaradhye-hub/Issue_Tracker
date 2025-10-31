#!/bin/sh
set -e

echo "Starting production entrypoint..."

# Run migrations
npx prisma migrate deploy  # Use npx; assumes prisma in lockfile

echo "Starting app..."
exec node dist/index.js