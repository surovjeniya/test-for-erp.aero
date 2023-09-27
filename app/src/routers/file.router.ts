import { Router } from "express";
import { fileController } from "../controllers/file.controller";
import multer from "multer";
import { storage } from "../config/storage.config";
import { authMiddleware } from "../middlewares/auth.middleware";
import { check, body } from "express-validator";
const upload = multer({ storage: storage });
//@ts-ignore
export const fileRouter = new Router();

fileRouter.post(
  "/upload",
  [body("file", "file is not be empty").notEmpty()],
  authMiddleware,
  upload.single("file"),
  fileController.uploadFile
);
fileRouter.get("/list", authMiddleware, fileController.getFilesList);
fileRouter.delete("/delete/:id", authMiddleware, fileController.deleteFile);
fileRouter.get("/:id", authMiddleware, fileController.getFile);
fileRouter.get("/download/:id", authMiddleware, fileController.downloadFile);
fileRouter.put(
  "/update/:id",
  [body("file", "file is not be empty").notEmpty()],
  authMiddleware,
  upload.single("file"),
  fileController.updateFile
);
