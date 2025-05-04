// apps/backend/src/routes/auth/otpRoutes.ts
import express from 'express'
import { sendOtp, verifyOtp } from '../../controllers/auth/otpController'

const router = express.Router()

// ✔️ Send OTP to email
router.post('/send-otp', sendOtp)

// ✔️ Verify submitted OTP
router.post('/verify-otp', verifyOtp)

export default router

