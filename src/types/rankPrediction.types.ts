export interface PerformanceMetrics {
    subjectWiseAccuracy: {
      physics: number;
      chemistry: number;
      biology: number;
    };
    overallAccuracy: number;
    consistencyScore: number;
    improvementRate: number;
  }
  
  export interface RankPredictionResult {
    predictedScore: number;
    predictedRank: {
      best: number;
      average: number;
      worst: number;
    };
    confidence: number;
    category: string;
    performanceMetrics: PerformanceMetrics;
  }
  