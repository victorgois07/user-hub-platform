import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const predefinedUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: process.env.SEED_PASSWORD ?? 'admin123',
    document: '12345678901',
    documentType: 'CPF' as const,
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: process.env.SEED_PASSWORD ?? 'admin123',
    document: '98765432101',
    documentType: 'CPF' as const,
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: process.env.SEED_PASSWORD ?? 'admin123',
    document: '45678912301',
    documentType: 'CPF' as const,
  },
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    password: process.env.SEED_PASSWORD ?? 'admin123',
    document: '78912345601',
    documentType: 'CPF' as const,
  },
  {
    firstName: 'Maria',
    lastName: 'Silva',
    email: 'maria.silva@example.com',
    password: process.env.SEED_PASSWORD ?? 'admin123',
    document: '32165498701',
    documentType: 'CPF' as const,
  },
];

function generateFakeUsers(count: number) {
  return Array.from({ length: count }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: process.env.SEED_PASSWORD ?? 'admin123',
    document: faker.string.numeric(11),
    documentType: 'CPF' as const,
  }));
}

const SEED_KEY = process.env.SEED_KEY ?? 'initial_seed_v1';

async function main() {
  const alreadySeeded = await prisma.seedMetadata.findUnique({
    where: { key: SEED_KEY },
  });

  if (alreadySeeded) {
    console.log('✅ Seed já foi executado anteriormente. Pulando...');
    return;
  }

  // Insert predefined users
  for (const u of predefinedUsers) {
    const hashedPassword = await bcrypt.hash(u.password, 12);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: hashedPassword,
        document: u.document,
        documentType: u.documentType,
      },
    });
  }

  // Generate and insert fake users
  const fakeUsers = generateFakeUsers(5);
  for (const u of fakeUsers) {
    const hashedPassword = await bcrypt.hash(u.password, 12);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: hashedPassword,
        document: u.document,
        documentType: u.documentType,
      },
    });
  }

  await prisma.seedMetadata.create({
    data: { key: SEED_KEY },
  });

  console.log(
    `✅ Seed executado com ${predefinedUsers.length} usuários predefinidos e ${fakeUsers.length} usuários aleatórios inseridos.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
