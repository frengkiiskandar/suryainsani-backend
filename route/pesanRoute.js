import express from "express";
import { createPesan, getPesan } from "../controller/Pesan.js";
const pesanRouter = express.Router();

pesanRouter.get('/pesan',getPesan)
pesanRouter.post('/pesan',createPesan)


export default pesanRouter