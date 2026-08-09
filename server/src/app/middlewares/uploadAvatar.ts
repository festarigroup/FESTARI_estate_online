import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import CustomError from "#app/utils/CustomError.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
      return;
    }
    cb(null, true);
  },
});

const singleAvatarUpload = upload.single("avatar");

export function uploadAvatarMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  singleAvatarUpload(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      next(new CustomError("Image must be 5MB or smaller.", 400));
      return;
    }

    next(new CustomError(error.message || "Failed to upload avatar.", 400));
  });
}
