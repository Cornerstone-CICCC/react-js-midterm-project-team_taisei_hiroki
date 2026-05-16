import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUserBody, LoginUserBody } from "../schemas/user.schema";
import { Role } from "../generated/prisma/client";

const fetchUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return null;
  }
  return user;
};

// For signup (defaults to customer; admin requires authenticated admin caller)
const add = async (data: CreateUserBody, role: Role = "customer") => {
  const { email, password } = data;

  const isExistUser = await prisma.user.findUnique({
    where: { email },
  });
  if (isExistUser) {
    return null;
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role,
    },
  });
};

// For login
const authCheck = async (data: LoginUserBody) => {
  const { email, password } = data;
  const loginUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!loginUser) {
    return null;
  }
  const isPassword = await bcrypt.compare(password, loginUser.password);
  if (!isPassword) {
    return null;
  }
  return loginUser;
};

export default {
  fetchUser,
  add,
  authCheck,
};
