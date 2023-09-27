import { Request } from "express";
import { AccessTokenPayload } from "./access-token-payload.interface";

export interface AuthUserRequest extends Request {
  user: AccessTokenPayload;
}
