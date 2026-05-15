"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = __importDefault(require("../controllers/item.controller"));
const itemRouter = (0, express_1.Router)();
itemRouter.get("/", item_controller_1.default.getAllItems);
itemRouter.get("/:id", item_controller_1.default.getItem);
itemRouter.post("/", item_controller_1.default.addItem);
itemRouter.patch("/:id", item_controller_1.default.updateItem);
itemRouter.delete("/:id", item_controller_1.default.deleteItem);
exports.default = itemRouter;
