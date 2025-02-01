import { RequestHandler } from 'express';
import { HistoricalDataService } from '../services/historicalData.service';

export class HistoricalDataController {
  public createHistoricalData: RequestHandler = async (req, res) => {
    try {
      const historicalData = await HistoricalDataService.createHistoricalData(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Historical data saved successfully',
        data: historicalData
      });
    } catch (error) {
      console.error('Error saving historical data:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to save historical data',
      });
    }
  };
}
