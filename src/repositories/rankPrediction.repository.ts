import { QuizSubmission } from '../models/QuizSubmission';
import { NEETHistoricalData } from '../models/NEETRankData';
import { RankPrediction } from '../models/RankPrediction';
import { PerformanceMetrics } from '../types/rankPrediction.types';

export class RankPredictionRepository {
  static async getPerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
    const results = await QuizSubmission.aggregate([
      { $match: { user_id: Number(userId) } },
      { $lookup: {
        from: 'quizzes',
        localField: 'quiz',
        foreignField: '_id',
        as: 'quizData'
      }},
      { $unwind: '$quizData' },
      { $addFields: {
        numericAccuracy: {
          $convert: {
            input: { $trim: { input: { $rtrim: { input: "$accuracy", chars: "%" } } } },
            to: "double",
            onError: 0
          }
        }
      }},
      { $group: {
        _id: '$quizData.topic',
        accuracy: { $avg: '$numericAccuracy' },
        attempts: { $sum: 1 },
        recentAccuracy: { 
          $avg: {
            $cond: [
              { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              '$numericAccuracy',
              null
            ]
          }
        }
      }}
    ]);

    // Calculate subject-wise accuracy
    const subjectWiseAccuracy = {
      physics: 0,
      chemistry: 0,
      biology: 0
    };

    let totalAccuracy = 0;
    let consistencyScore = 0;
    let improvementRate = 0;
    let subjectCount = 0;

    results.forEach(result => {
      const topic = result._id.toLowerCase();
      if (topic.includes('physics')) {
        subjectWiseAccuracy.physics = result.accuracy;
        subjectCount++;
      } else if (topic.includes('chemistry')) {
        subjectWiseAccuracy.chemistry = result.accuracy;
        subjectCount++;
      } else if (topic.includes('biology')) {
        subjectWiseAccuracy.biology = result.accuracy;
        subjectCount++;
      }

      totalAccuracy += result.accuracy;
      
      // Calculate improvement rate
      if (result.recentAccuracy) {
        improvementRate += (result.recentAccuracy - result.accuracy);
      }

      // Calculate consistency based on attempt frequency
      consistencyScore += Math.min(result.attempts / 10, 1); // Cap at 10 attempts
    });

    return {
      subjectWiseAccuracy,
      overallAccuracy: totalAccuracy / results.length,
      consistencyScore: (consistencyScore / results.length) * 100,
      improvementRate: (improvementRate / results.length) * 100
    };
  }

  static async getHistoricalData(): Promise<any> {
    const historicalData = await NEETHistoricalData.findOne().sort({ year: -1 }).exec();
    if (!historicalData) {
      console.warn('No historical data found');
    }
    return historicalData;
  }
  
  static async saveRankPrediction(prediction: any): Promise<any> {
    return RankPrediction.findOneAndUpdate(
      { userId: prediction.userId },
      prediction,
      { upsert: true, new: true }
    );
  }
}

