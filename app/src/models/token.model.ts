import { UserEntity } from "../entities/user.entity";

export class TokenModel {
  declare refresh_token: string;
  declare user: UserEntity;
}
