import express from "express";
import { authRouter } from "./routers/auth.router";
import { myDataSource } from "./config/datasource.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileRouter } from "./routers/file.router";
import { apiErrorMiddleware } from "./middlewares/api-error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/file", fileRouter);
app.use("/auth", authRouter);

app.use(apiErrorMiddleware);

const start = async (port: number) => {
  try {
    await myDataSource.initialize();
    app.listen(port, () => console.log("server has been started:", port));
  } catch (error: any) {
    console.error(error?.message || error);
    process.exit(1);
  }
};

start(Number(process.env.PORT) || 3155);
