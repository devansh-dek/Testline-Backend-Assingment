import mongoose, { Schema, Document } from 'mongoose';
import { Quiz as IQuiz } from '../interfaces/quiz.interface';

export interface QuizDocument extends IQuiz, Document {}

const QuizSchema: Schema = new Schema({
  _id: { type: Number, required: true, unique: true },
  name: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  difficulty_level: { type: String, default: null },
  topic: { type: String, required: true },
  duration: { type: Number, required: true },
  negative_marks: { type: String, required: true },
  correct_answer_marks: { type: String, required: true },
  questions_count: { type: Number, required: true },
  max_mistake_count: { type: Number, required: true }
}, {
  timestamps: true
});

export const Quiz = mongoose.model<QuizDocument>('Quiz', QuizSchema);
