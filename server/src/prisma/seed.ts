import { prisma } from "../lib/prisma";
import { seedItems } from "./seeds/item.seed";
import { seedUsers } from "./seeds/user.seed";

const main = async () => {
  await seedUsers();
  await seedItems();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
