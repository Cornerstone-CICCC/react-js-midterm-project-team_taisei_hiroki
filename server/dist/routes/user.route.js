"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = (0, express_1.Router)();
userRouter.get("/", user_controller_1.default.getAllUser);
userRouter.post("/signup/customer", user_controller_1.default.signup);
userRouter.post("/signup/admin", user_controller_1.default.signupAdmin);
userRouter.post("/login", user_controller_1.default.login);
userRouter.get("/userinfo", auth_middleware_1.authCheck, user_controller_1.default.getUserByCookie);
exports.default = userRouter;
