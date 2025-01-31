import { RequestHandler } from 'express';
import { PerformanceAnalyticsService } from '../services/performanceAnalytics.service';

export class AnalysisController {
  public getPerformanceAnalytics: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.params;
      const analytics = await PerformanceAnalyticsService.generateAnalytics(userId);
      res.status(200).json(analytics);
    } catch (error) {
      console.error('Error in getPerformanceAnalytics:', error);
      res.status(500).json({ message: 'Error generating analytics', error });
    }
  };
}
