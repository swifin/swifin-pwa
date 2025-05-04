// apps/backend/src/routes/auth/loginRoutes.ts
import express from 'express'
import { loginUser } from '../../controllers/user/userController'

const router = express.Router()

// ✔️ Login with Swifin ID and password
router.post('/login-swifin-id', loginUser)

export default router

