import { Router } from 'express';
import { NEETPredictionController } from '../controllers/neetPrediction.controller';

const router = Router();
const neetPredictionController = new NEETPredictionController();

router.post('/predict', neetPredictionController.predictColleges);

export default router;
