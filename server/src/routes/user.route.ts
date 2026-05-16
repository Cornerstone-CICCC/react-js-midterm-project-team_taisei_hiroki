import { Router } from "express";
import userController from "../controllers/user.controller";
import { authCheck } from "../middleware/auth.middleware";
import { adminCheck } from "../middleware/admin.middleware";

const userRouter = Router();

userRouter.post("/signup/customer", userController.signup);
userRouter.post("/admin", authCheck, adminCheck, userController.createAdmin);
userRouter.post("/login", userController.login);
userRouter.get("/userinfo", authCheck, userController.getUserByCookie);
userRouter.post("/logout", userController.logout);

export default userRouter;
