import express from "express";
import { createMutu, deleteMutu, getMutu } from "../controller/Mutu.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadImage } from "../middleware/upload.js";
const mutuRouter = express.Router()

mutuRouter.get('/mutu', getMutu)
mutuRouter.post('/mutu',verifyToken,uploadImage('mutu').single('file'), createMutu)
mutuRouter.delete('/mutu/:id',verifyToken, deleteMutu)

export default mutuRouter