echo "🔄 Running Prisma Generate..."
pnpm prisma generate

echo "🚀 Running Prisma Migrate..."
pnpm prisma migrate dev --name init

echo "🌱 Running Seed (if exists)..."
pnpm prisma db seed || echo "No seed script found or seeding skipped."

echo "✅ Starting development server..."
pnpm dev