import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "../common/base-entity";
import { UserEntity } from "../entities/user.entity";
import { TokenModel } from "../models/token.model";

@Entity({ name: "tokens" })
export class TokenEntity extends BaseEntity implements TokenModel {
  @Column({ nullable: false })
  declare refresh_token: string;

  @OneToOne(() => UserEntity, (user) => user.refresh_token)
  @JoinColumn()
  declare user: UserEntity;
}
