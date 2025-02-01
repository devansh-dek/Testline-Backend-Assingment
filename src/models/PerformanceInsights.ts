import mongoose, { Schema, Document } from 'mongoose';

interface IPerformanceInsights extends Document {
  userId: number;
  weakAreas: Array<{
    topic: string;
    accuracy: number;
    recommendedActions: string[];
    difficulty: string;
  }>;
  improvementTrends: Array<{
    topic: string;
    previousAccuracy: number;
    currentAccuracy: number;
    trend: number;
    period: string;
  }>;
  performanceGaps: Array<{
    topic: string;
    userAccuracy: number;
    averageAccuracy: number;
    gap: number;
  }>;
  lastUpdated: Date;
}

const PerformanceInsightsSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  weakAreas: [{
    topic: String,
    accuracy: Number,
    recommendedActions: [String],
    difficulty: String
  }],
  improvementTrends: [{
    topic: String,
    previousAccuracy: Number,
    currentAccuracy: Number,
    trend: Number,
    period: String
  }],
  performanceGaps: [{
    topic: String,
    userAccuracy: Number,
    averageAccuracy: Number,
    gap: Number
  }],
  lastUpdated: { type: Date, default: Date.now }
});

export const PerformanceInsights = mongoose.model<IPerformanceInsights>('PerformanceInsights', PerformanceInsightsSchema);

