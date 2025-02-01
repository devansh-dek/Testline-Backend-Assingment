export interface WeakArea {
    topic: string;
    accuracy: number;
    difficulty: string;
    recommendedActions: string[];
  }
  
  export interface ImprovementTrend {
    topic: string;
    previousAccuracy: number;
    currentAccuracy: number;
    trend: number;
    period: string;
  }
  
  export interface PerformanceGap {
    topic: string;
    userAccuracy: number;
    averageAccuracy: number;
    gap: number;
  }
  
  export interface TopicPerformance {
    topic: string;
    weekData: {
      weekNumber: number;
      accuracy: number;
    }[];
  }
  
  export interface RawPerformanceData {
    topic: any;
    _id: {
      topic: string;
      difficulty: string;
    };
    accuracy: number;
    attempts: number;
  }
  
  