import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import upload from '../middleware/upload.js';
import { validateRegistration } from '../middleware/validation.js';

const router = Router();

router.post('/login', login);
router.post('/register', upload.single('profilePicture'), validateRegistration, register);

export default router;
