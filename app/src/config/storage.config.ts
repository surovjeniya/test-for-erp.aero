import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(path.join(__dirname, "..", "..", "upload")))
      fs.mkdirSync(path.join(__dirname, "..", "..", "upload"));
    cb(null, path.join(__dirname, "..", "..", "upload"));
  },
  filename: (req, file, cb) => {
    const fileFormat = String(file.originalname.split(".").slice(-1));
    const fileName = `${v4()}.${fileFormat}`;
    cb(null, fileName);
  },
});
