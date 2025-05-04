// ✅ src/routes/auth/index.ts
import { Router } from 'express'
import loginRoutes from './loginRoutes'
import otpRoutes from './otpRoutes'
import flowRoutes from './flowRoutes'

const router = Router()

router.use('/login', loginRoutes)
router.use('/otp', otpRoutes)
router.use('/flow', flowRoutes)

export default router
