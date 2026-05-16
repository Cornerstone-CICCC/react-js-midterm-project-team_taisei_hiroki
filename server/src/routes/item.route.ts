import { Router } from "express";
import itemController from "../controllers/item.controller";
import { authCheck } from "../middleware/auth.middleware";
import { adminCheck } from "../middleware/admin.middleware";

const itemRouter = Router();

itemRouter.get("/", itemController.getAllItems);
itemRouter.get("/:id", itemController.getItem);
itemRouter.post("/", authCheck, adminCheck, itemController.addItem);
itemRouter.patch("/:id", authCheck, adminCheck, itemController.updateItem);
itemRouter.delete("/:id", authCheck, adminCheck, itemController.deleteItem);

export default itemRouter;
