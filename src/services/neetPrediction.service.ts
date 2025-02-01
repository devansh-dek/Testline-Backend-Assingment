import { NEETScore } from '../interfaces/neet.interface';
import { NEETHistoricalData, INEETHistoricalData } from '../models/NEETRankData';
import { NEETPredictionRepository } from '../repositories/neetPrediction.repository';

export class NEETPredictionService {
  private readonly SUBJECT_MAX_SCORE = 180;
  private readonly TOTAL_MAX_SCORE = 720;
  private predictionRepository: NEETPredictionRepository;

  constructor() {
    this.predictionRepository = new NEETPredictionRepository();
  }

  async predictColleges(scores: NEETScore) {
    try {
      // Validate scores
      this.validateScores(scores);

      // Calculate total score
      const totalScore = this.calculateTotalScore(scores);
      console.log('Total Score:', totalScore);

      // Get latest historical data
      const historicalData = await this.getLatestHistoricalData();
      if (!historicalData) {
        throw new Error('Historical data not found');
      }

      // Calculate rank with improved logic
      const predictedRank = this.calculateRankImproved(totalScore, historicalData);
      console.log('Predicted Rank:', predictedRank);

      // Get eligible colleges
      const predictedColleges = await this.getPredictedColleges(predictedRank);

      return {
        totalScore,
        predictedRank,
        predictedColleges,
        scoreAnalysis: {
          categoryStatus: this.checkCategoryStatus(totalScore, historicalData),
          subjectWiseAnalysis: this.analyzeSubjectPerformance(scores)
        }
      };
    } catch (error: any) {
      console.error('Prediction error:', error);
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  private calculateRankImproved(totalScore: number, historicalData: INEETHistoricalData): number {
    // Sort the score ranges for proper calculation
    const sortedRanges = [...historicalData.scoreRangeDistribution].sort((a, b) => {
      const [aMin] = a.range.split('-').map(Number);
      const [bMin] = b.range.split('-').map(Number);
      return bMin - aMin;
    });

    // Find the closest range for the given score
    let targetRange = sortedRanges[0];
    let minDifference = Infinity;

    for (const range of sortedRanges) {
      const [min, max] = range.range.split('-').map(Number);
      const rangeMid = (min + max) / 2;
      const difference = Math.abs(totalScore - rangeMid);

      if (difference < minDifference) {
        minDifference = difference;
        targetRange = range;
      }
    }

    // Calculate rank based on the closest range
    const [rangeMin, rangeMax] = targetRange.range.split('-').map(Number);
    const rangeSize = rangeMax - rangeMin;
    
    // Calculate position within range (0 to 1)
    let positionInRange: number;
    
    if (totalScore <= rangeMin) {
      positionInRange = 1; // Worst rank in this range
    } else if (totalScore >= rangeMax) {
      positionInRange = 0; // Best rank in this range
    } else {
      positionInRange = 1 - ((totalScore - rangeMin) / rangeSize);
    }

    // Calculate the actual rank
    const rangeStartRank = targetRange.averageRank + (targetRange.numberOfStudents / 2);
    const rangeEndRank = Math.max(1, targetRange.averageRank - (targetRange.numberOfStudents / 2));
    
    const predictedRank = Math.round(
      rangeEndRank + (positionInRange * (rangeStartRank - rangeEndRank))
    );

    return Math.max(1, Math.min(predictedRank, historicalData.totalCandidates));
  }

  private async getPredictedColleges(rank: number) {
    try {
      const minRank = Math.max(1, rank - 5000);
      const maxRank = rank + 2000;
      
      let colleges = await this.predictionRepository.findCollegesByRankRange(minRank, maxRank);
      
      if (!colleges || colleges.length === 0) {
        colleges = await this.predictionRepository.findAllColleges();
      }
      
      return colleges;
    } catch (error: any) {
      console.error('Error fetching colleges:', error);
      return [];
    }
  }

  private validateScores(scores: NEETScore): void {
    Object.entries(scores).forEach(([subject, score]) => {
      if (score === undefined || score === null) {
        throw new Error(`${subject} score is required`);
      }
      if (!Number.isInteger(score)) {
        throw new Error(`${subject} score must be an integer`);
      }
      if (score < 0 || score > this.SUBJECT_MAX_SCORE) {
        throw new Error(`${subject} score must be between 0 and ${this.SUBJECT_MAX_SCORE}`);
      }
    });
  }

  private calculateTotalScore(scores: NEETScore): number {
    return scores.physics + scores.chemistry + scores.biology;
  }

  private async getLatestHistoricalData(): Promise<INEETHistoricalData | null> {
    return await NEETHistoricalData.findOne().sort({ year: -1 }).exec();
  }

  private checkCategoryStatus(totalScore: number, historicalData: INEETHistoricalData) {
    return {
      general: totalScore >= historicalData.cutoffScores.general,
      obc: totalScore >= historicalData.cutoffScores.obc,
      sc: totalScore >= historicalData.cutoffScores.sc,
      st: totalScore >= historicalData.cutoffScores.st
    };
  }

  private analyzeSubjectPerformance(scores: NEETScore) {
    return {
      physics: {
        score: scores.physics,
        percentage: (scores.physics / this.SUBJECT_MAX_SCORE) * 100,
        status: this.getPerformanceStatus(scores.physics)
      },
      chemistry: {
        score: scores.chemistry,
        percentage: (scores.chemistry / this.SUBJECT_MAX_SCORE) * 100,
        status: this.getPerformanceStatus(scores.chemistry)
      },
      biology: {
        score: scores.biology,
        percentage: (scores.biology / this.SUBJECT_MAX_SCORE) * 100,
        status: this.getPerformanceStatus(scores.biology)
      }
    };
  }

  private getPerformanceStatus(score: number): 'Excellent' | 'Good' | 'Average' | 'NeedsImprovement' {
    const percentage = (score / this.SUBJECT_MAX_SCORE) * 100;
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 50) return 'Average';
    return 'NeedsImprovement';
  }
}