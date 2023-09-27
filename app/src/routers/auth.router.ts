import { authController } from "../controllers/auth.controller";
import { check } from "express-validator";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
//@ts-ignore
export const authRouter = new Router();

authRouter.post("/signin/new_token", authController.refresh);
authRouter.get("/logout", authController.logout);
authRouter.get("/info", authMiddleware, authController.info);
authRouter.post(
  "/signup",
  [
    check("user_id", "user_id is not be empty").notEmpty().isString(),
    check("password", "password is not be empty").notEmpty().isString(),
  ],
  authController.signup
);
authRouter.post(
  "/signin",
  [
    check("user_id", "id is not be empty").notEmpty(),
    check("password", "password is not be empty").notEmpty(),
  ],
  authController.signin
);
