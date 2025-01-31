import mongoose, { Schema, Document } from 'mongoose';
import { Quiz as IQuiz } from '../interfaces/quiz.interface';

export interface QuizDocument extends IQuiz, Document {}

const QuizSchema: Schema = new Schema(
  {
    name: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    difficulty_level: { type: String, default: null },
    topic: { type: String, required: true },
    time: { type: String, required: true },
    is_published: { type: Boolean, required: true },
    duration: { type: Number, required: true },
    end_time: { type: String, required: true },
    negative_marks: { type: String, required: true },
    correct_answer_marks: { type: String, required: true },
    shuffle: { type: Boolean, required: true },
    show_answers: { type: Boolean, required: true },
    questions_count: { type: Number, required: true },
    max_mistake_count: { type: Number, required: true },
    daily_date: { type: String, required: true },
    reading_materials: { type: [Schema.Types.Mixed], default: [] }
  },
  {
    timestamps: true
  }
);

export const Quiz = mongoose.model<QuizDocument>('Quiz', QuizSchema);
