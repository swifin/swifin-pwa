// apps/backend/src/routes/authRoutes.ts
import express from 'express';
import { authenticateUser } from '../controllers/authController';
import { submitProfile, registerNewUser } from '../controllers/userController';

const router = express.Router();

router.post('/login', authenticateUser);         // ✅ /auth/login
router.post('/submit-profile', submitProfile);   // ✅ /auth/submit-profile
router.post('/register', registerNewUser);       // ✅ /auth/register

export default router;

