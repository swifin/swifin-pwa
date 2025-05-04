// ✅ apps/backend/src/routes/auth/index.ts
import { Router } from 'express'
import loginRoutes from './loginRoutes'
import otpRoutes from './otpRoutes'
import flowRoutes from './flowRoutes'
import emailRoutes from './emailRoutes'

const router = Router()

router.use('/login', loginRoutes)        // POST /auth/login/...
router.use('/otp', otpRoutes)            // POST /auth/otp/verify-otp
router.use('/flow', flowRoutes)          // POST /auth/flow/...
router.use('/email', emailRoutes)        // POST /auth/email/...

export default router

