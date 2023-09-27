import { Router } from "express";
import { fileController } from "../controllers/file.controller";
import multer from "multer";
import { storage } from "../config/storage.config";
import { authMiddleware } from "../middlewares/auth.middleware";
const upload = multer({ storage: storage });
//@ts-ignore
export const fileRouter = new Router();

fileRouter.post(
  "/upload",
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
  authMiddleware,
  upload.single("file"),
  fileController.updateFile
);
