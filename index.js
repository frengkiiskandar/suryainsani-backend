import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/database.js";

// == import model yang akan di sync
import users from "./models/UserModel.js";
import galeri from "./models/GaleriModels.js";
import artikel from "./models/ArtikelModels.js";
import konten from "./models/KontenModels.js";
import dokter from "./models/DokterModels.js";
import jadwaldokter from "./models/JadwalDokterModels.js";
import iklan from "./models/IklanModels.js";
import pesan from "./models/PesanModels.js";
import mutu from "./models/mutuModels.js";

// router
import router from "./route/index.js";
import galeriRouter from "./route/galeriRoute.js";
import artikelRouter from "./route/artikelRoute.js";
import dokterRouter from "./route/dokterRoute.js";
import jadwalDokterRouter from "./route/jadwalDokterRoute.js";
import iklanRouter from "./route/iklanRoute.js";
import pesanRouter from "./route/pesanRoute.js";
import mutuRouter from "./route/mutuRoute.js";

import cookieParser from "cookie-parser";
import cors from "cors";

import multer from "multer";
import kontenRouter from "./route/kontenRoute.js";

const app = express();

try {
  await db.authenticate();
  await db.sync({alter : true})
} catch (error) {
  console.log(error);
}

const allowedOrigins = [
  "http://localhost:3000",
  "https://suryainsani-frontend.vercel.app",
  "https://www.rssuryainsani.com",
  "https://rssuryainsani.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // kalau request dari Postman atau curl
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
app.use(iklanRouter);
app.use(pesanRouter);
app.use(mutuRouter);

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
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running at port ${process.env.PORT} ...`);
});
