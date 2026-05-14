"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authCheck = (req, res, next) => {
    const TOKEN_SECRET = process.env.JWT_SECRET;
    if (!TOKEN_SECRET) {
        res.status(500).json({ message: "Unable to verify token" });
        return;
    }
    const { token } = req.cookies;
    if (!token) {
        res.status(401).send("Your are not logged in");
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
        if (typeof decoded === "string") {
            res.status(401).json({ message: "You are not logged in" });
            return;
        }
        if (decoded.userId && decoded.role) {
            req.user = { userId: decoded.userId, role: decoded.role };
            next();
        }
        else {
            res.status(401).json({ message: "You are not logged in" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "Missing access token" });
    }
};
exports.authCheck = authCheck;
