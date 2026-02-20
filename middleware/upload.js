import multer from "multer";
import path from "path";
import fs from "fs";

export const uploadImage = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${folderName}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, "-")
        .toLowerCase();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${name}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/webp" ||
      // word
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      // Excel
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File Type tidak sesuai"), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 }, // 1MB
  });
};
