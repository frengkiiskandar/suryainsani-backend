import express from 'express'

// import constract controller function
import { GetUser, Register, UpdateUser, DeleteUser,Login ,Logout, Me,} from '../controller/User.js'
import { refreshToken } from '../controller/RefreshToken.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/users',verifyToken,GetUser)      
router.post('/users',Register)      
router.patch(`/users/:id`,verifyToken,UpdateUser)      
router.delete(`/users/:id`,verifyToken,DeleteUser)      
router.post(`/login`,Login)    
// untuk refresh token  
router.get(`/token`,refreshToken)      

router.get('/me',verifyToken, Me)
router.delete(`/logout`,Logout) 


export default router