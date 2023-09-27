import { NextFunction, Request, Response } from "express";
import { fileService } from "../services/file.service";
import { AuthUserRequest } from "../interfaces/auth-user-request.interface";
import { validationResult } from "express-validator";
import { ApiError } from "../common/api-error";

class FileController {
  async uploadFile(req: AuthUserRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //@ts-ignore
        throw ApiError.BadRequest("File upload error", errors);
      }
      const uploadedFile = await fileService.uploadFile(
        req.file as Express.Multer.File,
        req.user.id
      );
      return res.status(201).json({ uploadedFile });
    } catch (error) {
      next(error);
    }
  }

  async getFilesList(req: AuthUserRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { list_size, page } = req.query;
      const { files, page_count } = await fileService.getFilesList(
        user,
        list_size ? +list_size : 10,
        page ? +page : 1
      );
      res.status(200).json({ data: files, page_count });
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: AuthUserRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { id } = req.params;
      const deleteFileResult = await fileService.deleteFile(user.id, +id);
      return res.status(200).json({ message: deleteFileResult });
    } catch (error) {
      next(error);
    }
  }

  async getFile(req: AuthUserRequest, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { id } = req.params;
      const file = await fileService.getFile(user?.id, +id);
      return res.status(200).json({ file });
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req: AuthUserRequest, res: Response, next: NextFunction) {
    try {
      const fileData = await fileService.downloadFile(
        +req.params.id,
        +req.user.id
      );
      fileData?.readStream?.pipe(res);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileData?.fileFromDb?.originalname}`
      );
      res.setHeader("Content-Type", fileData?.fileFromDb?.mimetype || "");
      res.setHeader("Content-Length", fileData?.fileFromDb.file_size || 0);
      res.setHeader("Cache-Control", "no-store");
    } catch (error) {
      next(error);
    }
  }

  async updateFile(req: AuthUserRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //@ts-ignore
        throw ApiError.BadRequest("File upload error", errors);
      }
      const updateResult = await fileService.updateFile(
        +req.params.id,
        req.user.id,
        req.file as Express.Multer.File
      );
      return res.status(200).json({ message: "File will be updated." });
    } catch (error) {
      next(error);
    }
  }
}

export const fileController = new FileController();
