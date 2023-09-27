import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { FileEntity } from "../entities/file.entity";
import { myDataSource } from "../config/datasource.config";
import * as fs from "fs";
import { AccessTokenPayload } from "../interfaces/access-token-payload.interface";
import { ApiError } from "../common/api-error";

export class FileService {
  fileRepository: Repository<FileEntity>;
  constructor() {
    this.fileRepository = myDataSource.getRepository(FileEntity);
  }

  async getFile(userId: number, fileId: number): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { user: { id: userId }, id: fileId },
    });
    if (!file) {
      throw ApiError.NotFoundError("Not found.");
    }
    return file;
  }

  async getFilesList(
    user: AccessTokenPayload,
    list_size: number,
    page: number
  ) {
    const skip = (page - 1) * list_size;
    const [files, count] = await this.fileRepository.findAndCount({
      where: { user: { id: user.id } },
      take: list_size,
      skip,
    });

    return {
      files,
      page_count: Math.ceil(count / list_size),
    };
  }

  async deleteFile(userId: number, fileId: number): Promise<DeleteResult> {
    const file = await this.getFile(userId, fileId);
    await fs.promises.rm(file.path);
    return await this.fileRepository.delete({ id: file.id });
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: number
  ): Promise<FileEntity> {
    const newFile = this.fileRepository.create({
      user: {
        id: userId,
      },
      path: file?.path,
      file_size: file?.size,
      encoding: file?.encoding,
      mimetype: file?.mimetype,
      originalname: file?.originalname,
    });
    return await this.fileRepository.save(newFile);
  }

  async updateFile(
    fileId: number,
    userId: number,
    file: Express.Multer.File
  ): Promise<UpdateResult | undefined> {
    const fileFromDb = await this.fileRepository.findOne({
      where: {
        id: fileId,
        user: { id: userId },
      },
    });
    if (!fileFromDb) throw ApiError.NotFoundError();

    if (fileFromDb) {
      await fs.promises.rm(fileFromDb.path);
      return await this.fileRepository.update(
        { id: fileFromDb.id },
        {
          updated_at: new Date(),
          encoding: file?.encoding,
          file_size: file?.size,
          mimetype: file?.mimetype,
          path: file?.path,
          originalname: file?.originalname,
        }
      );
    }
  }

  async downloadFile(
    fileId: number,
    userId: number
  ): Promise<
    { readStream: fs.ReadStream; fileFromDb: FileEntity } | undefined
  > {
    const fileFromDb = await this.fileRepository.findOne({
      where: {
        id: fileId,
        user: { id: userId },
      },
    });
    if (!fileFromDb) throw ApiError.NotFoundError();
    if (fileFromDb) {
      const readStream = fs.createReadStream(fileFromDb.path);
      return { readStream, fileFromDb };
    }
  }
}

export const fileService = new FileService();
