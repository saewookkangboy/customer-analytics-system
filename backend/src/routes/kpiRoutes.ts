import { Router } from 'express';
import { KPIController } from '../controllers/KPIController';

const router = Router();

// KPI 데이터 라우트
router.get('/metrics', KPIController.getMetrics);
router.get('/trends', KPIController.getTrends);
router.get('/comparison', KPIController.getComparison);

export default router; 