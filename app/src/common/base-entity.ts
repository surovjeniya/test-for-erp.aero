import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn()
  declare id: number;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;
}
