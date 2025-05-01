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
router.post('/login', loginUser);
router.post('/register', registerProfile);
router.put('/update', updateProfile);
router.get('/user/:swifinId', getUser);

// Auth Route
router.post('/auth', authenticateUser);

export default router;

