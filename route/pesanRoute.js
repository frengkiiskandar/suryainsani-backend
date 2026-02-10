import express from "express";
import { createPesan, deletePesan, getPesan, getPesanById, updatePesanByTelp } from "../controller/Pesan.js";
const pesanRouter = express.Router();

pesanRouter.get('/pesan',getPesan)
pesanRouter.get('/pesan/:id',getPesanById)
pesanRouter.post('/pesan',createPesan)
pesanRouter.patch('/pesan',updatePesanByTelp)
pesanRouter.delete('/pesan/:id',deletePesan)


export default pesanRouter