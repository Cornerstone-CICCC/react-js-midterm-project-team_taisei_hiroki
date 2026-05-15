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
exports.seedUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const hashedAdminPassword = yield bcrypt_1.default.hash("Admin123!", 12);
    const hashedCustomerPassword = yield bcrypt_1.default.hash("Customer123!", 12);
    yield prisma_1.prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {
            userName: "adminUser",
            password: hashedAdminPassword,
            role: "admin",
        },
        create: {
            userName: "adminUser",
            email: "admin@example.com",
            password: hashedAdminPassword,
            role: "admin",
        },
    });
    yield prisma_1.prisma.user.upsert({
        where: { email: "customer@example.com" },
        update: {
            userName: "customerUser",
            password: hashedCustomerPassword,
            role: "customer",
        },
        create: {
            userName: "customerUser",
            email: "customer@example.com",
            password: hashedCustomerPassword,
            role: "customer",
        },
    });
});
exports.seedUsers = seedUsers;
