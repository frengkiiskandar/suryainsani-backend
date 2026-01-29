import express from "express";
import dotenv from "dotenv";
import db from "./config/database.js";

// == import model yang akan di sync
import users from "./models/UserModel.js";
import galeri from "./models/GaleriModels.js";
import artikel from "./models/ArtikelModels.js";
import konten from "./models/KontenModels.js";
import dokter from "./models/DokterModels.js";
import jadwaldokter from "./models/JadwalDokterModels.js";

// router
import router from "./route/index.js";
import galeriRouter from "./route/galeriRoute.js";
import artikelRouter from "./route/artikelRoute.js";
import dokterRouter from "./route/dokterRoute.js";
import jadwalDokterRouter from "./route/jadwalDokterRoute.js";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import multer from "multer";
import kontenRouter from "./route/kontenRoute.js";

const app = express();

try {
  await db.authenticate();
  // await db.sync({alter : true})
} catch (error) {
  console.log(error);
}
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  }),
);

app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(express.json());

// pakai router nya
app.use(router);
app.use(galeriRouter);
app.use(artikelRouter);
app.use(dokterRouter);
app.use(jadwalDokterRouter);
app.use(kontenRouter);

// jika errror mimetype atau ukuran file
app.use((err, req, res, next) => {
  // error dari multer (size limit, dll)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      msg: err.message,
    });
  }

  // error dari fileFilter
  if (err) {
    return res.status(400).json({
      msg: err.message,
    });
  }

  next();
});

app.listen(5000, () => {
  console.log(`server running at port ${process.env.PORT} ...`);
});
