import express from 'express'
import { createJadwalDokter, deleteJadwalDokter, getJadwalById, getJadwalDokter, getJadwalDokterByIdDokter, updateJadwalDokter } from '../controller/JadwalDokter.js'
import { verifyToken } from '../middleware/verifyToken.js'

const jadwalDokterRouter = express.Router()

jadwalDokterRouter.get('/jadwalDokter', getJadwalDokter)
jadwalDokterRouter.get('/dokter/:dokterId/jadwal', getJadwalDokterByIdDokter)
jadwalDokterRouter.get('/jadwalDokter/:id', getJadwalById)
jadwalDokterRouter.post('/jadwalDokter/:id/jadwalDokter',verifyToken ,createJadwalDokter)
jadwalDokterRouter.patch('/jadwalDokter/:id',verifyToken, updateJadwalDokter)
jadwalDokterRouter.delete('/jadwalDokter/:id',verifyToken, deleteJadwalDokter)

export default jadwalDokterRouter