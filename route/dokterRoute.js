import express from 'express'
const dokterRouter = express.Router()

import { getDokter, createDokter, getDokterById, updateDokter, deleteDokter } from '../controller/Dokter.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { uploadImage } from '../middleware/upload.js'

dokterRouter.get('/dokter', getDokter)
dokterRouter.get('/dokter/:id', getDokterById)
dokterRouter.post('/dokter', verifyToken, uploadImage('dokter').single('image'), createDokter)
dokterRouter.patch('/dokter/:id', verifyToken, uploadImage('dokter').single('image'), updateDokter)
dokterRouter.delete('/dokter/:id', verifyToken, deleteDokter)

export default dokterRouter