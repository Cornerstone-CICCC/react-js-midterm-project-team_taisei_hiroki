"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemSchema = exports.createItemSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createItemSchema = zod_1.default.object({
    title: zod_1.default.string().min(1),
    description: zod_1.default.string().min(1),
    price: zod_1.default.int(),
    image: zod_1.default.string().min(1),
});
exports.updateItemSchema = zod_1.default.object({
    title: zod_1.default.string().min(1).optional(),
    description: zod_1.default.string().min(1).optional(),
    price: zod_1.default.int().optional(),
    image: zod_1.default.string().min(1).optional(),
});
