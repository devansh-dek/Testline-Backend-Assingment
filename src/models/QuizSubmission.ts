import mongoose, { Schema, Document } from 'mongoose';
import { QuizSubmission as IQuizSubmission } from '../interfaces/quiz.interface';

export interface QuizSubmissionDocument extends IQuizSubmission, Document {
  quiz: mongoose.Types.ObjectId; // Reference to Quiz model
  user_id: mongoose.Types.ObjectId; // Ensure ObjectId is used for users
}

const QuizSubmissionSchema: Schema = new Schema(
  {
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    submitted_at: { type: String, required: true },
    created_at: { type: String, required: true },
    updated_at: { type: String, required: true },
    score: { type: Number, required: true },
    trophy_level: { type: Number, required: true },
    accuracy: { type: String, required: true },
    speed: { type: String, required: true },
    final_score: { type: String, required: true },
    negative_score: { type: String, required: true },
    correct_answers: { type: Number, required: true },
    incorrect_answers: { type: Number, required: true },
    source: { type: String, enum: ['exam', 'live'], required: true },
    type: { type: String, required: true },
    started_at: { type: String, required: true },
    ended_at: { type: String, required: true },
    duration: { type: String, required: true },
    better_than: { type: Number, required: true },
    total_questions: { type: Number, required: true },
    rank_text: { type: String, required: true },
    mistakes_corrected: { type: Number, required: true },
    initial_mistake_count: { type: Number, required: true },
    response_map: { type: Map, of: Number, required: true }
  },
  {
    timestamps: true
  }
);

export const QuizSubmission = mongoose.model<QuizSubmissionDocument>(
  'QuizSubmission',
  QuizSubmissionSchema
);
