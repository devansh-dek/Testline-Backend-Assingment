import { RankPredictionRepository } from '../repositories/rankPrediction.repository';
import { PerformanceMetrics, RankPredictionResult } from '../types/rankPrediction.types';
import { INEETHistoricalData } from '../models/NEETRankData';

export class RankPredictionService {
  private static readonly NEET_MAX_SCORE = 720;
  private static readonly SUBJECT_WEIGHTS = {
    physics: 0.3,
    chemistry: 0.3,
    biology: 0.4
  };

  static async predictRank(userId: string, category: string = 'general'): Promise<RankPredictionResult> {
    try {
      // Validate user ID
      if (!userId || isNaN(Number(userId))) {
        throw new Error('Invalid user ID');
      }

      // Fetch and validate performance metrics
      const metrics = await RankPredictionRepository.getPerformanceMetrics(userId);
      this.validatePerformanceMetrics(metrics);
      
      // Fetch and validate historical data
      const historicalData = await RankPredictionRepository.getHistoricalData();
      this.validateHistoricalData(historicalData);
      
      // Calculate the predicted score
      const predictedScore = this.calculatePredictedScore(metrics);
      
      // Validate and adjust score if necessary
      const { adjustedScore, isAdjusted } = this.validateAndAdjustScore(predictedScore, historicalData);
      
      // Calculate the rank range based on adjusted score
      const rankRange = this.calculateRankRange(adjustedScore, historicalData, category);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(metrics, isAdjusted);

      const prediction: RankPredictionResult = {
        userId: Number(userId),
        predictedScore: adjustedScore,
        originalScore: isAdjusted ? predictedScore : undefined,
        predictedRank: rankRange,
        confidence,
        category,
        performanceMetrics: metrics,
        lastUpdated: new Date(),
        isAdjusted
      };

      // Save prediction
      await RankPredictionRepository.saveRankPrediction(prediction);

      return prediction;
    } catch (error) {
      console.error('Error in rank prediction:', error);
      throw new Error(`Failed to generate rank prediction: `);
    }
  }

  private static validatePerformanceMetrics(metrics: PerformanceMetrics): void {
    if (!metrics?.subjectWiseAccuracy) {
      throw new Error('Invalid performance metrics: Missing subject-wise accuracy');
    }
  
    const subjects = ['physics', 'chemistry', 'biology'];
    subjects.forEach(subject => {
      // Type assertion to let TypeScript know the structure of the object
      const accuracy = metrics.subjectWiseAccuracy[subject as keyof PerformanceMetrics['subjectWiseAccuracy']];
  
      if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
        throw new Error(`Invalid ${subject} accuracy score`);
      }
    });
  }
  

  private static validateHistoricalData(data: INEETHistoricalData): void {
    if (!data?.scoreRangeDistribution?.length) {
      throw new Error('Invalid historical data: Missing score range distribution');
    }
  
    // Validate score ranges are properly formatted and sequential
    let previousMax = -1;
    data.scoreRangeDistribution.forEach(range => {
      const [min, max] = range.range.split('-').map(Number);
  
      // Check if the score range is valid within the bounds of 0-720
      if (isNaN(min) || isNaN(max) || min > max || min < 0 || max > this.NEET_MAX_SCORE) {
        throw new Error(`Invalid score range: ${range.range}`);
      }
  
      // Ensure that the ranges are sequential
      if (min <= previousMax) {
        throw new Error(`Non-sequential score ranges detected: ${range.range}`);
      }
  
      previousMax = max;
    });
  }
  

  private static validateAndAdjustScore(score: number, historicalData: INEETHistoricalData): { adjustedScore: number; isAdjusted: boolean } {
    const ranges = historicalData.scoreRangeDistribution;
    const minScore = Math.min(...ranges.map(r => Number(r.range.split('-')[0])));
    const maxScore = Math.max(...ranges.map(r => Number(r.range.split('-')[1])));

    if (score < minScore || score > maxScore) {
      const adjustedScore = Math.max(minScore, Math.min(maxScore, score));
      console.warn(`Score ${score} adjusted to ${adjustedScore} to fit within valid range [${minScore}-${maxScore}]`);
      return { adjustedScore, isAdjusted: true };
    }

    return { adjustedScore: score, isAdjusted: false };
  }

  private static calculatePredictedScore(metrics: PerformanceMetrics): number {
    const weightedScore = (
      metrics.subjectWiseAccuracy.physics * this.SUBJECT_WEIGHTS.physics +
      metrics.subjectWiseAccuracy.chemistry * this.SUBJECT_WEIGHTS.chemistry +
      metrics.subjectWiseAccuracy.biology * this.SUBJECT_WEIGHTS.biology
    );

    const consistencyFactor = (metrics.consistencyScore || 0) / 100;
    const improvementFactor = Math.max(0, metrics.improvementRate || 0) / 100;

    const finalScore = weightedScore * (1 + consistencyFactor * 0.1 + improvementFactor * 0.1);
    return Math.round(finalScore * this.NEET_MAX_SCORE / 100);
  }

  private static calculateRankRange(score: number, historicalData: INEETHistoricalData, category: string): { best: number; average: number; worst: number } {
    const matchingRange = historicalData.scoreRangeDistribution.find(range => {
      const [min, max] = range.range.split('-').map(Number);
      return score >= min && score <= max;
    });

    if (!matchingRange) {
      // Find closest range if no exact match
      const ranges = historicalData.scoreRangeDistribution;
      const closestRange = ranges.reduce((closest, current) => {
        const [currentMin, currentMax] = current.range.split('-').map(Number);
        const [closestMin, closestMax] = closest.range.split('-').map(Number);
        const currentMid = (currentMin + currentMax) / 2;
        const closestMid = (closestMin + closestMax) / 2;
        return Math.abs(currentMid - score) < Math.abs(closestMid - score) ? current : closest;
      });
      
      // Apply category-specific adjustments if needed
      const categoryAdjustment = this.getCategoryAdjustment(category, historicalData);
      const baseRank = closestRange.averageRank * categoryAdjustment;
      const variation = baseRank * 0.1;

      return {
        best: Math.max(1, Math.round(baseRank - variation)),
        average: Math.round(baseRank),
        worst: Math.round(baseRank + variation)
      };
    }

    const categoryAdjustment = this.getCategoryAdjustment(category, historicalData);
    const baseRank = matchingRange.averageRank * categoryAdjustment;
    const variation = baseRank * 0.1;

    return {
      best: Math.max(1, Math.round(baseRank - variation)),
      average: Math.round(baseRank),
      worst: Math.round(baseRank + variation)
    };
  }

  private static getCategoryAdjustment(category: string, historicalData: INEETHistoricalData): number {
    const cutoffs = historicalData.cutoffScores;
    const generalCutoff = cutoffs.general;
    
    switch (category.toLowerCase()) {
      case 'obc':
        return generalCutoff / cutoffs.obc;
      case 'sc':
        return generalCutoff / cutoffs.sc;
      case 'st':
        return generalCutoff / cutoffs.st;
      default:
        return 1;
    }
  }

  private static calculateConfidence(metrics: PerformanceMetrics, isAdjusted: boolean): number {
    const weights = {
      consistency: 0.4,
      improvement: 0.3,
      accuracy: 0.3
    };

    let confidenceScore = 
      ((metrics.consistencyScore || 0) * weights.consistency) +
      (Math.max(0, metrics.improvementRate || 0) * weights.improvement) +
      ((metrics.overallAccuracy || 0) * weights.accuracy);

    // Reduce confidence if score needed adjustment
    if (isAdjusted) {
      confidenceScore *= 0.8;
    }

    return Math.min(100, Math.round(confidenceScore));
  }
}
