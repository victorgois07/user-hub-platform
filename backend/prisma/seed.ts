import { faker } from '@faker-js/faker';
import { DocumentType, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateFakeUsers(count: number) {
  return Array.from({ length: count }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: process.env.SEED_PASSWORD ?? 'admin123',
    document: faker.string.numeric(11),
    documentType: 'CPF' as DocumentType,
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

  const users = generateFakeUsers(10);

  for (const u of users) {
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

  console.log(`✅ Seed executado com ${users.length} usuários inseridos.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
