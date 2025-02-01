import mongoose, { Schema, Document } from 'mongoose';

export interface INEETHistoricalData extends Document {
  year: number;
  totalSeats: number;
  totalCandidates: number;
  cutoffScores: {
    general: number;
    obc: number;
    sc: number;
    st: number;
  };
  scoreRangeDistribution: {
    range: string;  // e.g., "650-700"
    averageRank: number;
    numberOfStudents: number;
  }[];
}

const NEETHistoricalDataSchema = new Schema({
  year: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  totalCandidates: { type: Number, required: true },
  cutoffScores: {
    general: { type: Number, required: true },
    obc: { type: Number, required: true },
    sc: { type: Number, required: true },
    st: { type: Number, required: true }
  },
  scoreRangeDistribution: [{
    range: { type: String, required: true },
    averageRank: { type: Number, required: true },
    numberOfStudents: { type: Number, required: true }
  }]
});

export const NEETHistoricalData = mongoose.model<INEETHistoricalData>('NEETHistoricalData', NEETHistoricalDataSchema);
