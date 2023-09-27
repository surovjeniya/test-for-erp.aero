import { FileEntity } from "../entities/file.entity";
import { TokenEntity } from "../entities/token.entity";

export class UserModel {
  declare user_id: string;
  declare password: string;
  declare refresh_token: TokenEntity;
  declare files: FileEntity[];
}
