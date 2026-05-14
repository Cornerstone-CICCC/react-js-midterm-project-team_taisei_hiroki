import { Router, Request, Response } from "express";
import userController from "../controllers/user.controller";
import { authCheck } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/", userController.getAllUser);
userRouter.post("/signup/customer", userController.signup);
userRouter.post("/signup/admin", userController.signupAdmin);
userRouter.post("/login", userController.login);
userRouter.get("/userinfo", authCheck, userController.getUserByCookie);
userRouter.post("/logout", userController.logout);

export default userRouter;
