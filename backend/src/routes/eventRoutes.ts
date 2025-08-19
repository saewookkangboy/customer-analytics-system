import { Router } from 'express';
import { EventController } from '../controllers/EventController';

const router = Router();

// 이벤트 데이터 라우트
router.post('/', EventController.create);
router.get('/', EventController.getAll);
router.get('/recent', EventController.getRecent);
router.get('/analytics', EventController.getAnalytics);

export default router; 