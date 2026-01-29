import express from "express";
const galeriRouter = express.Router();

import { verifyToken } from "../middleware/verifyToken.js";
import { getDataGaleri,getGaleriById, createGaleri, updateGaleri, deleteGaleri } from "../controller/Galeri.js";
import { uploadImage } from "../middleware/upload.js";



// route
galeriRouter.get("/galeri", getDataGaleri);
galeriRouter.get("/galeri/:id",verifyToken, getGaleriById);
galeriRouter.post("/galeri",verifyToken, uploadImage('galeri').single('image') ,createGaleri);
galeriRouter.patch("/galeri/:id",verifyToken, uploadImage('galeri').single('image') ,updateGaleri);
galeriRouter.delete("/galeri/:id",verifyToken ,deleteGaleri);

export default galeriRouter;
