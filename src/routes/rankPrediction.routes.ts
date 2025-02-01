import { Router } from 'express';
import { RankPredictionController } from '../controllers/rankPrediction.controller';

const router = Router();
const rankPredictionController = new RankPredictionController();

router.get('/rank-prediction/:userId', rankPredictionController.getRankPrediction);

export default router;
