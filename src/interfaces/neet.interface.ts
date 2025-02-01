export interface NEETScore {
    physics: number;
    chemistry: number;
    biology: number;
  }
  
  export interface NEETPredictionResult {
    totalScore: number;
    predictedRank: number;
    predictedColleges: College[];
    scoreAnalysis: {
      categoryStatus: Record<string, boolean>;
      subjectWiseAnalysis: {
        [subject: string]: {
          score: number;
          percentage: number;
          status: 'Excellent' | 'Good' | 'Average' | 'NeedsImprovement';
        };
      };
    };
  }
  
  export interface College {
    name: string;
    city: string;
    state: string;
    lastYearCutoff: number;
    totalSeats: number;
    category: 'Government' | 'Private';
  }
  