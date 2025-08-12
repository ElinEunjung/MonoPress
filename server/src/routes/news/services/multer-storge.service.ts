import multer from "multer";
import path from "path";
import type { Request } from "express";

// Configure Multer for local storage
const localDiskStorage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // Files will be stored in the 'public/uploads' directory
    cb(null, "public/uploads/");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    // Usethe original filename with a unique timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const multerStorage = {
  uploadToLocalServer() {
    return multer({ storage: localDiskStorage });
  },
};
