import mongoose, { Schema, Document } from 'mongoose';

interface IPerformanceAnalytics extends Document {
  userId: number;
  topicWisePerformance: Map<string, {
    accuracy: number;
    totalAttempts: number;
    timeSpent: number;
    lastAttempted: Date;
  }>;
  difficultyLevelPerformance: Map<string, {
    accuracy: number;
    totalAttempts: number;
    averageTime: number;
  }>;
}

const PerformanceAnalyticsSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  topicWisePerformance: {
    type: Map,
    of: {
      accuracy: Number,
      totalAttempts: Number,
      timeSpent: Number,
      lastAttempted: Date
    }
  },
  difficultyLevelPerformance: {
    type: Map,
    of: {
      accuracy: Number,
      totalAttempts: Number,
      averageTime: Number
    }
  }
}, { timestamps: true });

export const PerformanceAnalytics = mongoose.model<IPerformanceAnalytics>('PerformanceAnalytics', PerformanceAnalyticsSchema);
