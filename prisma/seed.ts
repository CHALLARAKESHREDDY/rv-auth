import { PrismaClient } from '@prisma/client';
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 1000; i++) {
    await prisma.user.create({
      data: {
        name: faker.internet.username(),
        email: faker.internet.email(),
        phoneNumber: faker.string.numeric(10),
        occupation: 'FARMER'
      },
    });
  }
  console.log('Seeding completed.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
