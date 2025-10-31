import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const password = await bcrypt.hash('password123', 10);

  // Create users
  const superAdmin = await prisma.user.create({
    data: { name: 'fasfdd', email: 'superadmin@example.com', password, role: 'super-admin' },
  });

  const admin = await prisma.user.create({
    data: { name: 'fasfa', email: 'admin@example.com', password, role: 'admin' },
  });

  const user = await prisma.user.create({
    data: { name: 'fasf', email: 'user@example.com', password, role: 'user' },
  });

  // Create issues for each user
  await prisma.issue.createMany({
    data: [
      {
        title: 'Fix authentication bug',
        description: 'Login token not refreshing properly',
        priority: 'HIGH',
        userId: superAdmin.id,
      },
      {
        title: 'Add pagination to issue list',
        description: 'Frontend table needs pagination and sorting',
        priority: 'MEDIUM',
        userId: admin.id,
      },
      {
        title: 'Update UI theme',
        description: 'Dark mode toggle missing on settings page',
        priority: 'LOW',
        userId: user.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
