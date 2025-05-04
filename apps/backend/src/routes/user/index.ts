// ✅ src/routes/user/index.ts
import { Router } from 'express'
import { activateWallet } from '@/controllers/user/activateController'
import { registerNewUser } from '@/controllers/user/registerController'
import { updateProfile } from '@/controllers/user/profileController'
import { loginUser } from '@/controllers/user/userController'

const router = Router()

router.post('/register', registerNewUser)
router.post('/profile', updateProfile)
router.post('/wallet/activate', activateWallet)
router.post('/login', loginUser)

export default router

