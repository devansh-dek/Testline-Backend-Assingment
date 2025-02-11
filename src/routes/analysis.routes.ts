import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';

const router = Router();
const analysisController = new AnalysisController();

router.get('/analytics/:userId', analysisController.getPerformanceAnalytics);
router.get('/insights/:userId', analysisController.getPerformanceInsights);


export default router;