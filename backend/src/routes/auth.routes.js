import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import upload from '../middleware/upload.js';
import { validateRegistration } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/register', authLimiter, upload.single('profilePicture'), validateRegistration, register);

export default router;
