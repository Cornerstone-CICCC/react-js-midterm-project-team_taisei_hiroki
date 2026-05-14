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
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const fetchAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findMany();
});
const fetchUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        return null;
    }
    return user;
});
// For signup
const add = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const isExistUser = yield prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (isExistUser) {
        return null;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    return yield prisma_1.prisma.user.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword, role: "customer" }),
    });
});
// For admin signup
const addAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const isExistUser = yield prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (isExistUser) {
        return null;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    return yield prisma_1.prisma.user.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword, role: "admin" }),
    });
});
// For login
const authCheck = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const loginUser = yield prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!loginUser) {
        return null;
    }
    const isPassword = yield bcrypt_1.default.compare(password, loginUser.password);
    if (!isPassword) {
        return null;
    }
    return loginUser;
});
exports.default = {
    fetchAll,
    fetchUser,
    add,
    addAdmin,
    authCheck,
};
