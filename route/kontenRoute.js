import expresss from 'express'
import { getKonten, createKonten, getKontenById, updateKonten, deleteKonten } from '../controller/Konten.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { uploadImage } from '../middleware/upload.js'

const kontenRouter = expresss.Router()

kontenRouter.get('/konten', getKonten)
kontenRouter.get('/konten/:id', getKontenById)
kontenRouter.post('/konten', verifyToken,uploadImage('konten').single('image'),createKonten)
kontenRouter.patch('/konten/:id', verifyToken,uploadImage('konten').single('image'),updateKonten)
kontenRouter.delete('/konten/:id', verifyToken,deleteKonten)


export default kontenRouter