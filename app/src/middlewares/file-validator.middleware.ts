import { NextFunction, Response, Request } from "express";
import { ApiError } from "../common/api-error";

export const fileValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    throw ApiError.BadRequest("File is not be empty");
  }
  next();
};
