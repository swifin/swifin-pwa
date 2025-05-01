import express from 'express';
import {
  loginUser,
  updateProfile,
  registerProfile,
  getUser,
} from '../controllers/userController';
import { authenticateUser } from '../controllers/authController';

const router = express.Router();

// User Routes
router.post('/login', loginUser);             // POST /auth/login
router.post('/register', registerProfile);    // POST /auth/register
router.put('/update', updateProfile);         // PUT /auth/update
router.get('/user/:swifinId', getUser);       // GET /auth/user/:swifinId

// Auth Route
router.post('/auth', authenticateUser);       // POST /auth (SOAP-based login)

export default router;

