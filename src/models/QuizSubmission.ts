import { QuizSubmission as IQuizSubmission } from '../interfaces/quiz.interface';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';
export interface QuizSubmissionDocument extends IQuizSubmission, Document {}

const QuizSubmissionSchema: Schema = new Schema({
  quiz_id: { type: Number, required: true },
  user_id: { type: String, required: true },
  score: { type: Number, required: true },
  trophy_level: { type: Number, required: true },
  accuracy: { type: String, required: true },
  speed: { type: String, required: true },
  final_score: { type: String, required: true },
  negative_score: { type: String, required: true },
  correct_answers: { type: Number, required: true },
  incorrect_answers: { type: Number, required: true },
  mistakes_corrected: { type: Number, required: true },
  initial_mistake_count: { type: Number, required: true },
  response_map: { type: Map, of: Number, required: true },
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true }
}, {
  timestamps: true
});

export const QuizSubmission = mongoose.model<QuizSubmissionDocument>('QuizSubmission', QuizSubmissionSchema);
