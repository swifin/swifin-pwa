// apps/backend/src/routes/userRoutes.ts
import express from 'express'
import {
  submitProfile,
  registerNewUser,
  activateWallet,
  loginUser,
} from '../controllers/userController'

const router = express.Router()

router.post('/submit', submitProfile)
router.post('/register', registerNewUser)
router.post('/activate', activateWallet)
router.post('/login', loginUser)

export default router

