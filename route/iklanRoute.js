import express from "express";
import { createIklan, deleteIklan, getIklan, getIklanById, getIklanIsActive, toggleIklanActive } from "../controller/Iklan.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadImage } from "../middleware/upload.js";
const iklanRouter = express.Router();

iklanRouter.get('/iklan' , getIklan)
iklanRouter.get('/iklan/:id' , getIklanById)
iklanRouter.get('/active' , getIklanIsActive)
iklanRouter.patch('/iklan/:id/activeToggle' , toggleIklanActive)
iklanRouter.post('/iklan' ,verifyToken, uploadImage('iklan').single('image'),createIklan)
iklanRouter.delete('/iklan/:id' ,verifyToken, deleteIklan)

export default iklanRouter