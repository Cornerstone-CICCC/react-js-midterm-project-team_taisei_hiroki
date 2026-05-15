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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedItems = void 0;
const prisma_1 = require("../../lib/prisma");
const seedItemsData = [
    {
        title: "Mechanical Keyboard",
        description: "Compact keyboard with tactile switches",
        price: 129,
        image: "https://example.com/images/keyboard.jpg",
    },
    {
        title: "Wireless Mouse",
        description: "Lightweight mouse with rechargeable battery",
        price: 79,
        image: "https://example.com/images/mouse.jpg",
    },
    {
        title: "USB-C Hub",
        description: "Multi-port hub for laptop setup",
        price: 49,
        image: "https://example.com/images/hub.jpg",
    },
];
const seedItems = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of seedItemsData) {
        const existingItem = yield prisma_1.prisma.item.findFirst({
            where: { title: item.title },
        });
        if (existingItem) {
            yield prisma_1.prisma.item.update({
                where: { id: existingItem.id },
                data: item,
            });
            continue;
        }
        yield prisma_1.prisma.item.create({
            data: item,
        });
    }
});
exports.seedItems = seedItems;
