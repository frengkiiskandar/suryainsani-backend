import express from 'express'
import { createJadwalDokter, deleteJadwalDokter, getJadwalById, getJadwalDokter, getJadwalDokterByIdDokter, updateJadwalDokter } from '../controller/JadwalDokter.js'
import { verifyToken } from '../middleware/verifyToken.js'

const jadwalDokterRouter = express.Router()

jadwalDokterRouter.get('/jadwal/:jadwalId', getJadwalById)
jadwalDokterRouter.get('/jadwal', getJadwalDokter)
jadwalDokterRouter.get('/dokter/:dokterId/jadwal', getJadwalDokterByIdDokter)
jadwalDokterRouter.post('/jadwalDokter/:id/jadwalDokter',verifyToken ,createJadwalDokter)
jadwalDokterRouter.patch('/jadwalDokter/:id',verifyToken, updateJadwalDokter)
jadwalDokterRouter.delete('/jadwalDokter/:id',verifyToken, deleteJadwalDokter)

export default jadwalDokterRouter