import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { hash } from "bcrypt";
import { TokenEntity } from "./token.entity";
import { BaseEntity } from "../common/base-entity";
import { FileEntity } from "./file.entity";
import { UserModel } from "../models/user.model";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity implements UserModel {
  @Column({ nullable: false, unique: true })
  declare user_id: string;

  @Column({ nullable: false })
  declare password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 3);
  }

  @OneToOne(() => TokenEntity, (token) => token.user)
  @JoinColumn()
  declare refresh_token: TokenEntity;

  @OneToMany(() => FileEntity, (file) => file.user)
  declare files: FileEntity[];
}
