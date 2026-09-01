import express from 'express';
import { registerUser, loginUser, getMe, updateProfile, forgotPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Protected Auth Routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
