import { UserEntity } from "../entities/user.entity";

export class FileModel {
  declare originalname: string;
  declare encoding: string;
  declare mimetype: string;
  declare file_size: number;
  declare path: string;
  declare user: UserEntity;
}
