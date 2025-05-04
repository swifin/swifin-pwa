// apps/backend/src/routes/auth/flowRoutes.ts
import express from 'express'
import { emailCheck } from '@/controllers/auth/emailController'
import { updateProfile } from '@/controllers/user/profileController'
import { registerNewUser } from '@/controllers/user/registerController'

const router = express.Router()

// ✔️ Check if email is already in use
router.post('/email-check', emailCheck)

// ✔️ Register a new user (no Swifin ID)
router.post('/register-new', registerNewUser)

// ✔️ Submit or update Swifin user profile
router.post('/submit-profile', updateProfile)

export default router

