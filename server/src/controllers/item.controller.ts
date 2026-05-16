import { Request, Response } from "express";
import itemModel from "../models/item.model";
import { createItemSchema, updateItemSchema } from "../schemas/item.schema";
import { Prisma } from "../generated/prisma/client";

const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await itemModel.fetchAll();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

const getItem = async (req: Request<{ id: number }>, res: Response) => {
  const { id } = req.params;
  const itemId = Number(id);

  if (Number.isNaN(itemId)) {
    res.status(400).json({ message: "invalid id" });
    return;
  }
  try {
    const item = await itemModel.fetchById(itemId);
    if (!item) {
      res.status(404).json({ message: "item was not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

const addItem = async (req: Request, res: Response) => {
  const parsed = createItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues });
    return;
  }
  try {
    const addedItem = await itemModel.add(parsed.data);

    res.status(201).json(addedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = updateItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues });
    return;
  }
  const itemId = Number(id);

  if (Number.isNaN(itemId)) {
    res.status(400).json({ message: "invalid id" });
    return;
  }
  try {
    const updatedItem = await itemModel.update(itemId, parsed.data);
    res.status(200).json(updatedItem);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "item was not found" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const itemId = Number(id);

  if (Number.isNaN(itemId)) {
    res.status(400).json({ message: "invalid id" });
    return;
  }
  try {
    const deletedItem = await itemModel.remove(itemId);
    res.status(200).json(deletedItem);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "item was not found" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

export default {
  getAllItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
};
