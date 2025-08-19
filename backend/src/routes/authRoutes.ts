import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// 인증 라우트
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.get('/profile', AuthController.getProfile);

export default router; 