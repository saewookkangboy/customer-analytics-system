import express from 'express';
import { SettingController } from '../controllers/SettingController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// 설정 라우트
router.get('/', asyncHandler(SettingController.getAllSettings));
router.get('/category/:category', asyncHandler(SettingController.getSettingsByCategory));
router.put('/update', asyncHandler(SettingController.updateSettings));
router.post('/reset/:category?', asyncHandler(SettingController.resetSettings));
router.get('/export', asyncHandler(SettingController.exportSettings));

export default router; 