import { RequestHandler } from 'express';
import { RankPredictionService } from '../services/rankPrediction.services';

export class RankPredictionController {
  public getRankPrediction: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.params;
      const { category } = req.query;
      
      const prediction = await RankPredictionService.predictRank(
        userId, 
        category as string || 'general'
      );
      
      res.status(200).json({
        status: 'success',
        data: prediction
      });
    } catch (error) {
      console.error('Error in getRankPrediction:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Error generating rank prediction',
      });
    }
  };
}
