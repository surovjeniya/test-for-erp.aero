import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/base-entity";
import { UserEntity } from "./user.entity";
import { FileModel } from "../models/file.model";

@Entity({ name: "files" })
export class FileEntity extends BaseEntity implements FileModel {
  @Column({ nullable: false })
  declare originalname: string;

  @Column({ nullable: false })
  declare encoding: string;

  @Column({ nullable: false })
  declare mimetype: string;

  @Column({ nullable: false })
  declare file_size: number;

  @Column({ nullable: false })
  declare path: string;

  @ManyToOne(() => UserEntity, (user) => user.files)
  declare user: UserEntity;
}
