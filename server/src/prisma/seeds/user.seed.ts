import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

export const seedUsers = async () => {
  const hashedAdminPassword = await bcrypt.hash("Admin123!", 12);
  const hashedCustomerPassword = await bcrypt.hash("Customer123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      userName: "adminUser",
      password: hashedAdminPassword,
      role: "admin",
    },
    create: {
      userName: "adminUser",
      email: "admin@example.com",
      password: hashedAdminPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {
      userName: "customerUser",
      password: hashedCustomerPassword,
      role: "customer",
    },
    create: {
      userName: "customerUser",
      email: "customer@example.com",
      password: hashedCustomerPassword,
      role: "customer",
    },
  });
};
