import mongoose, { Schema } from "mongoose";

interface IRankPrediction extends Document {
    userId: number;
    predictedScore: number;
    predictedRank: {
      best: number;
      average: number;
      worst: number;
    };
    confidence: number;
    category: string;
    lastUpdated: Date;
    performanceMetrics: {
      subjectWiseAccuracy: {
        physics: number;
        chemistry: number;
        biology: number;
      };
      overallAccuracy: number;
      consistencyScore: number;
      improvementRate: number;
    };
  }
  
  const RankPredictionSchema = new Schema({
    userId: { type: Number, required: true },
    predictedScore: { type: Number, required: true },
    predictedRank: {
      best: { type: Number, required: true },
      average: { type: Number, required: true },
      worst: { type: Number, required: true }
    },
    confidence: { type: Number, required: true },
    category: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    performanceMetrics: {
      subjectWiseAccuracy: {
        physics: { type: Number, required: true },
        chemistry: { type: Number, required: true },
        biology: { type: Number, required: true }
      },
      overallAccuracy: { type: Number, required: true },
      consistencyScore: { type: Number, required: true },
      improvementRate: { type: Number, required: true }
    }
  });
  
  export const RankPrediction = mongoose.model<IRankPrediction>('RankPrediction', RankPredictionSchema);
  
  