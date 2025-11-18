import express from 'express';
import {
    register,
    login,
    getMe,
    logout,
    changePassword
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// PUBLIC ROUTES
router.post('/register', register);
router.post('/login', login);

// PROTECTED ROUTES
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.post('/change-password', authenticate, changePassword);

export default router;