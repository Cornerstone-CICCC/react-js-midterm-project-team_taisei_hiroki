import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUserBody, LoginUserBody } from "../schemas/user.schema";

const fetchAll = async () => {
  return await prisma.user.findMany();
};

// For signup
const add = async (data: CreateUserBody) => {
  const { email, password } = data;

  const users = await fetchAll();
  const isExistUser = users.some((user) => user.email === email);
  if (isExistUser) {
    return null;
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: "customer",
    },
  });
};

// For admin signup
const addAdmin = async (data: CreateUserBody) => {
  const { email, password } = data;

  const users = await fetchAll();
  const isExistUser = users.some((user) => user.email === email);
  if (isExistUser) {
    return null;
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: "admin",
    },
  });
};

// For login
const authCheck = async (data: LoginUserBody) => {
  const { email, password } = data;
  const users = await fetchAll();
  const loginUser = users.find((user) => user.email === email);
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
  fetchAll,
  add,
  addAdmin,
  authCheck,
};
