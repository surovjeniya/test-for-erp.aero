import { NextFunction, Request, Response } from "express";
import { tokenService } from "../services/token.service";
import { ApiError } from "../common/api-error";
import { AuthUserRequest } from "../interfaces/auth-user-request.interface";
import { AccessTokenPayload } from "../interfaces/access-token-payload.interface";

export const authMiddleware = (
  req: AuthUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(ApiError.UnauthorizedError());

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return next(ApiError.UnauthorizedError());

    const userData = tokenService.verifyToken(accessToken);
    if (!userData) return next(ApiError.UnauthorizedError());

    req.user = userData as AccessTokenPayload;
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};
