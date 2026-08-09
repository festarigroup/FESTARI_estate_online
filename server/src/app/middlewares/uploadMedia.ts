import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import CustomError from "#app/utils/CustomError.js";

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export function createUploadMiddleware(options: {
  fieldName: string;
  maxFiles?: number;
  maxSizeMb?: number;
  allowVideo?: boolean;
}) {
  const maxFiles = options.maxFiles ?? 1;
  const maxSizeMb = options.maxSizeMb ?? 5;
  const allowedTypes = options.allowVideo ? [...IMAGE_TYPES, ...VIDEO_TYPES] : IMAGE_TYPES;

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMb * 1024 * 1024, files: maxFiles },
    fileFilter: (_req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
        return;
      }
      cb(null, true);
    },
  });

  const handler = maxFiles > 1 ? upload.array(options.fieldName, maxFiles) : upload.single(options.fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, (error) => {
      if (!error) {
        next();
        return;
      }

      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        next(new CustomError(`File must be ${maxSizeMb}MB or smaller.`, 400));
        return;
      }

      next(new CustomError(error.message || "Failed to upload file.", 400));
    });
  };
}
