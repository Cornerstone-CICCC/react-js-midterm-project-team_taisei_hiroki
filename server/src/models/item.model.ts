import { prisma } from "../lib/prisma";
import { CreateItemBody, UpdateItemBody } from "../schemas/item.schema";

const fetchAll = async () => {
  const items = await prisma.item.findMany();
  return items;
};

const fetchById = async (id: number) => {
  const item = await prisma.item.findUnique({
    where: { id },
  });
  if (!item) {
    return null;
  }
  return item;
};

const add = async (data: CreateItemBody) => {
  const addedItem = await prisma.item.create({ data });
  return addedItem;
};

const update = async (id: number, data: UpdateItemBody) => {
  const updatedItem = await prisma.item.update({
    where: { id },
    data,
  });
  return updatedItem;
};

const remove = async (id: number) => {
  const removedItem = await prisma.item.delete({
    where: { id },
  });
  return removedItem;
};

export default {
  fetchAll,
  fetchById,
  add,
  update,
  remove,
};
