import { RankPredictionRepository } from '../repositories/rankPrediction.repository';
import { PerformanceMetrics, RankPredictionResult } from '../types/rankPrediction.types';

export class RankPredictionService {
  private static readonly NEET_MAX_SCORE = 720;
  private static readonly SUBJECT_WEIGHTS = {
    physics: 0.3,
    chemistry: 0.3,
    biology: 0.4
  };

  static async predictRank(userId: string, category: string = 'general'): Promise<RankPredictionResult> {
    try {
      // Get performance metrics
      const metrics = await RankPredictionRepository.getPerformanceMetrics(userId);
      
      // Get historical NEET data
      const historicalData = await RankPredictionRepository.getHistoricalData();
      console.log('Historical Data:', historicalData);

      // Calculate predicted score
      const predictedScore = this.calculatePredictedScore(metrics);
      
      // Calculate rank range
      const rankRange = this.calculateRankRange(predictedScore, historicalData, category);
      
      // Calculate confidence based on consistency and improvement
      const confidence = this.calculateConfidence(metrics);

      const prediction = {
        userId: Number(userId),
        predictedScore,
        predictedRank: rankRange,
        confidence,
        category,
        performanceMetrics: metrics,
        lastUpdated: new Date()
      };

      // Save prediction
      await RankPredictionRepository.saveRankPrediction(prediction);

      return prediction;
    } catch (error) {
      console.error('Error in rank prediction:', error);
      throw new Error('Failed to generate rank prediction');
    }
  }

  private static calculatePredictedScore(metrics: PerformanceMetrics): number {
    const { subjectWiseAccuracy } = metrics;
    
    // Calculate weighted score based on subject weights
    const weightedScore = (
      subjectWiseAccuracy.physics * this.SUBJECT_WEIGHTS.physics +
      subjectWiseAccuracy.chemistry * this.SUBJECT_WEIGHTS.chemistry +
      subjectWiseAccuracy.biology * this.SUBJECT_WEIGHTS.biology
    );

    // Apply consistency and improvement factors
    const consistencyFactor = metrics.consistencyScore / 100;
    const improvementFactor = Math.max(0, metrics.improvementRate) / 100;

    // Calculate final score
    const finalScore = weightedScore * (1 + consistencyFactor * 0.1 + improvementFactor * 0.1);
    
    // Convert to NEET score scale
    return Math.round(finalScore * this.NEET_MAX_SCORE / 100);
  }

  private static calculateRankRange(score: number, historicalData: any, category: string): { best: number; average: number; worst: number } {
    // Safely access the scoreRangeDistribution using optional chaining
    const scoreRanges = historicalData?.scoreRangeDistribution;
  
    if (!scoreRanges) {
      throw new Error('Historical data or score range distribution is missing');
    }
  
    let matchingRange;
    
    for (const range of scoreRanges) {
      const [min, max] = range.range.split('-').map(Number);
      if (score >= min && score <= max) {
        matchingRange = range;
        break;
      }
    }
  
    if (!matchingRange) {
      throw new Error('Score out of historical data range');
    }
  
    // Calculate rank range with 10% variation
    const baseRank = matchingRange.averageRank;
    const variation = baseRank * 0.1;
  
    return {
      best: Math.max(1, Math.round(baseRank - variation)),
      average: Math.round(baseRank),
      worst: Math.round(baseRank + variation)
    };
  }
  

  private static calculateConfidence(metrics: PerformanceMetrics): number {
    // Weight factors for confidence calculation
    const weights = {
      consistency: 0.4,
      improvement: 0.3,
      accuracy: 0.3
    };

    // Calculate confidence score
    const confidenceScore = 
      (metrics.consistencyScore * weights.consistency) +
      (Math.max(0, metrics.improvementRate) * weights.improvement) +
      (metrics.overallAccuracy * weights.accuracy);

    // Return confidence percentage (capped at 100%)
    return Math.min(100, Math.round(confidenceScore));
  }
}
