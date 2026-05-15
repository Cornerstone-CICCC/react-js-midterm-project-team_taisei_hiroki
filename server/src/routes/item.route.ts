import { Router } from "express";
import itemController from "../controllers/item.controller";

const itemRouter = Router();

itemRouter.get("/", itemController.getAllItems);
itemRouter.get("/:id", itemController.getItem);
itemRouter.post("/", itemController.addItem);
itemRouter.patch("/:id", itemController.updateItem);
itemRouter.delete("/:id", itemController.deleteItem);

export default itemRouter;
