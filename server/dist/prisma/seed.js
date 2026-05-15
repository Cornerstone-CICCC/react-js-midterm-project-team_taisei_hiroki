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
const item_seed_1 = require("./seeds/item.seed");
const user_seed_1 = require("./seeds/user.seed");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_seed_1.seedUsers)();
    yield (0, item_seed_1.seedItems)();
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.$disconnect();
}))
    .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
    console.error("Seed failed:", error);
    yield prisma_1.prisma.$disconnect();
    process.exit(1);
}));
