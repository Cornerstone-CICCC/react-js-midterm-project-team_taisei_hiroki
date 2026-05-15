"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const item_model_1 = __importDefault(require("../models/item.model"));
const item_schema_1 = require("../schemas/item.schema");
const client_1 = require("../generated/prisma/client");
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield item_model_1.default.fetchAll();
        res.status(200).json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
const getItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const itemId = Number(id);
    if (Number.isNaN(itemId)) {
        res.status(400).json({ message: "invalid id" });
        return;
    }
    try {
        const item = yield item_model_1.default.fetchById(itemId);
        if (!item) {
            res.status(404).json({ message: "item was not found" });
            return;
        }
        res.status(200).json(item);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
const addItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = item_schema_1.createItemSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues });
        return;
    }
    try {
        const addedItem = yield item_model_1.default.add(parsed.data);
        res.status(201).json(addedItem);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const parsed = item_schema_1.updateItemSchema.safeParse(req.body);
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
        const updatedItem = yield item_model_1.default.update(itemId, parsed.data);
        res.status(200).json(updatedItem);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025") {
            res.status(404).json({ message: "item was not found" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const itemId = Number(id);
    if (Number.isNaN(itemId)) {
        res.status(400).json({ message: "invalid id" });
        return;
    }
    try {
        const deletedItem = yield item_model_1.default.remove(itemId);
        res.status(200).json(deletedItem);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025") {
            res.status(404).json({ message: "item was not found" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
exports.default = {
    getAllItems,
    getItem,
    addItem,
    updateItem,
    deleteItem,
};
