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
    userId: number;
    predictedScore: number;
    originalScore?: number;
    predictedRank: {
      best: number;
      average: number;
      worst: number;
    };
    confidence: number;
    category: string;
    performanceMetrics: PerformanceMetrics;
    lastUpdated: Date;
    isAdjusted?: boolean;
  }
  
  