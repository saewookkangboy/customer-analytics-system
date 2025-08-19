import { Router } from 'express';
import { ScenarioController } from '../controllers/ScenarioController';

const router = Router();

// 시나리오 CRUD 라우트
router.post('/', ScenarioController.create);
router.get('/', ScenarioController.getAll);
router.get('/:id', ScenarioController.getById);
router.get('/:id/with-stages', ScenarioController.getWithStages);
router.put('/:id', ScenarioController.update);
router.delete('/:id', ScenarioController.delete);

// 시나리오 분석 라우트
router.get('/:id/performance', ScenarioController.getPerformanceStats);
router.get('/:id/funnel', ScenarioController.getFunnelData);
router.get('/:id/dropout', ScenarioController.getDropoutAnalysis);

export default router; 