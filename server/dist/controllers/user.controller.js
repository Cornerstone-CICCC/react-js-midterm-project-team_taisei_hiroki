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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const user_schema_1 = require("../schemas/user.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// get all users
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.fetchAll();
        const publicUsers = users.map((user) => {
            return {
                userName: user.userName,
                role: user.role,
            };
        });
        res.status(200).json(publicUsers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
// user signup for customer
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_schema_1.createUserSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues });
        return;
    }
    const { userName, email, password } = parsed.data;
    const passwordScore = (0, zxcvbn_1.default)(password).score;
    if (passwordScore <= 1) {
        res.status(400).json({ message: "Password is too weak" });
        return;
    }
    try {
        const newUser = yield user_model_1.default.add({
            userName,
            email,
            password,
        });
        if (!newUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const { password: _password, email: _email } = newUser, publicUser = __rest(newUser, ["password", "email"]);
        res.status(201).json(publicUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
// user signup for admin
const signupAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_schema_1.createUserSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues });
        return;
    }
    const { userName, email, password } = parsed.data;
    const passwordScore = (0, zxcvbn_1.default)(password).score;
    if (passwordScore <= 1) {
        res.status(400).json({ message: "Password is too weak" });
        return;
    }
    try {
        const newUser = yield user_model_1.default.addAdmin({
            userName,
            email,
            password,
        });
        if (!newUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const { password: _password } = newUser, publicUser = __rest(newUser, ["password"]);
        res.status(201).json(publicUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
// user login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = user_schema_1.loginUserSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues });
        return;
    }
    const { email, password } = parsed.data;
    try {
        const loginUser = yield user_model_1.default.authCheck({
            email,
            password,
        });
        if (!loginUser) {
            res.status(400).json({ message: "Failed to login" });
            return;
        }
        const payload = {
            userId: loginUser.id,
            role: loginUser.role,
        };
        const secretKey = process.env.JWT_SECRET;
        const expiresIn = process.env
            .JWT_EXPIRES_IN;
        const token = jsonwebtoken_1.default.sign(payload, secretKey, {
            expiresIn: expiresIn,
        });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });
        const { password: _password, email: _email } = loginUser, publicUser = __rest(loginUser, ["password", "email"]);
        res.status(200).json(publicUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
exports.default = {
    getAllUser,
    signup,
    signupAdmin,
    login,
};
