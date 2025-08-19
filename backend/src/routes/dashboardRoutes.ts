import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// 대시보드 데이터 라우트
router.get('/overview', asyncHandler(DashboardController.getOverview));
router.get('/funnels', asyncHandler(DashboardController.getFunnels));
router.get('/kpi-trends', asyncHandler(DashboardController.getKPITrends));
router.get('/recent-events', asyncHandler(DashboardController.getRecentEvents));
router.get('/scenario-performance', asyncHandler(DashboardController.getScenarioPerformance));
router.get('/category-metrics', asyncHandler(DashboardController.getCategoryMetrics));

export default router; 