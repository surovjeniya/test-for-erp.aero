import { DataSource } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { TokenEntity } from "../entities/token.entity";
import { FileEntity } from "../entities/file.entity";

export const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.MY_SQL_HOST || "localhost",
  port: Number(process.env.MY_SQL_PORT) || 3306,
  username: process.env.MYSQL_USER || "surovjeniya",
  password: process.env.MYSQL_PASSWORD || "19953101Qw",
  database: process.env.MYSQL_DATABASE || "test-database",
  entities: [UserEntity, TokenEntity, FileEntity],
  synchronize: true,
});
