import mongoose from "mongoose";
export interface Quiz {
  name: string | null;
  title: string;
  description: string;
  difficulty_level: string | null;
  topic: string;
  time: string;
  is_published: boolean;
  duration: number;
  end_time: string;
  negative_marks: string;
  correct_answer_marks: string;
  shuffle: boolean;
  show_answers: boolean;
  questions_count: number;
  max_mistake_count: number;
  daily_date: string;
  reading_materials: any[];
}
export interface QuizSubmission {
  quiz_id: number;
  user_id: Number | mongoose.Types.ObjectId;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  score: number;
  trophy_level: number;
  accuracy: string;
  speed: string;
  final_score: string;
  negative_score: string;
  correct_answers: number;
  incorrect_answers: number;
  source: 'exam' | 'live';
  type: string;
  started_at: string;
  ended_at: string;
  duration: string;
  better_than: number;
  total_questions: number;
  rank_text: string;
  mistakes_corrected: number;
  initial_mistake_count: number;
  response_map: Record<string, number>;
  quiz: mongoose.Types.ObjectId; 
}


export interface Question {
  description: string;
  topic: string;
  difficulty_level: string | null;
  detailed_solution: string;
  options: QuestionOption[];
}

interface QuestionOption {
  description: string;
  is_correct: boolean;
}

