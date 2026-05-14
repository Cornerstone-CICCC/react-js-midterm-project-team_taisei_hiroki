import { Router, Request, Response } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", userController.getAllUser);
userRouter.post("/signup/customer", userController.signup);
userRouter.post("/signup/admin", userController.signupAdmin);
userRouter.post("/login", userController.login);

export default userRouter;
