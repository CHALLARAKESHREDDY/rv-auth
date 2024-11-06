import { PrismaClient } from '@prisma/client';
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
   const count= await prisma.user.count()
   console.log(count)
   const user = await prisma.user.findFirst({
     where: {
       id: 10901,
     },
   });
   console.log(user)

  for (let i = 0; i < 10000; i++) {
    
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
