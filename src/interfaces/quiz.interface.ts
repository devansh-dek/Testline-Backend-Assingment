export interface Quiz {
    name: string | null;
    title: string;
    description: string;
    difficulty_level: string | null;
    topic: string;
    duration: number;
    negative_marks: string;
    correct_answer_marks: string;
    questions_count: number;
    max_mistake_count: number;
  }
  
  export interface QuizSubmission {
    quiz_id: number;
    user_id: string;
    score: number;
    trophy_level: number;
    accuracy: string;
    speed: string;
    final_score: string;
    negative_score: string;
    correct_answers: number;
    incorrect_answers: number;
    mistakes_corrected: number;
    initial_mistake_count: number;
    response_map: Record<string, number>;
    quiz: Quiz;
  }
  