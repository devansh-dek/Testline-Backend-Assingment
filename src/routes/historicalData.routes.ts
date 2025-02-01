import { Router } from 'express';
import { HistoricalDataController } from '../controllers/historicalData.controller';

const router = Router();
const historicalDataController = new HistoricalDataController();

// Route to create historical data
router.post('/historical-data', historicalDataController.createHistoricalData);

export default router;
