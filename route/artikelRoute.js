import expresss from 'express'

const artikelRouter = expresss.Router()

import { verifyToken } from '../middleware/verifyToken.js'
// import controller
import { getArtikel,getArtikelById, createArtikel, updateArtikel, deleteArtikel } from '../controller/Artikel.js'
import { uploadImage } from '../middleware/upload.js'

artikelRouter.get('/artikel' ,getArtikel)
artikelRouter.get('/artikel/:id' ,getArtikelById)
artikelRouter.post('/artikel',verifyToken,uploadImage('artikel').single('image') , createArtikel)
artikelRouter.patch('/artikel/:id',verifyToken,uploadImage('artikel').single('image') , updateArtikel)
artikelRouter.delete('/artikel/:id',verifyToken,deleteArtikel)

export default artikelRouter