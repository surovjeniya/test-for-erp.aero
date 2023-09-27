import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { authService } from "../services/auth.service";
import { AuthUserRequest } from "../interfaces/auth-user-request.interface";
import { ApiError } from "../common/api-error";

class AuthController {
  async info(req: AuthUserRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.info(req.user);
      return res.status(200).json({
        user: {
          id: user.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) res.status(401).json({ message: "Unauthorized." });
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logout complete." });
    } catch (error) {
      next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //@ts-ignore
        throw ApiError.BadRequest("Signup error", errors);
      }
      const signUpData = await authService.signup(
        req.body.user_id,
        req.body.password
      );
      res.cookie("refreshToken", signUpData.tokens.refreshToken, {
        httpOnly: true,
        maxAge:
          Number(process.env.API_SERVICE_JWT_REFRESH_EXPIRATION) ||
          31 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        ...signUpData.tokens,
        user: {
          user_id: signUpData.savedUser.user_id,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //@ts-ignore
        throw ApiError.BadRequest("Signup error", errors);
      }
      const { tokens, user } = await authService.signin(
        req.body.user_id,
        req.body.password
      );
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge:
          Number(process.env.API_SERVICE_JWT_REFRESH_EXPIRATION) ||
          31 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        ...tokens,
        user: {
          user_id: user.user_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) throw ApiError.UnauthorizedError();
      const accessToken = await authService.refresh(refreshToken);
      return res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
