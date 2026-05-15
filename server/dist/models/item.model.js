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
const prisma_1 = require("../lib/prisma");
const fetchAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield prisma_1.prisma.item.findMany();
    return items;
});
const fetchById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield prisma_1.prisma.item.findUnique({
        where: { id },
    });
    if (!item) {
        return null;
    }
    return item;
});
const add = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const addedItem = yield prisma_1.prisma.item.create({ data });
    return addedItem;
});
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedItem = yield prisma_1.prisma.item.update({
        where: { id },
        data,
    });
    return updatedItem;
});
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const removedItem = yield prisma_1.prisma.item.delete({
        where: { id },
    });
    return removedItem;
});
exports.default = {
    fetchAll,
    fetchById,
    add,
    update,
    remove,
};
