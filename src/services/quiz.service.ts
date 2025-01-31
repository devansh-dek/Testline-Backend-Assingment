import { QuizRepository } from '../repositories/quiz.repository';
import { QuizSubmissionRepository } from '../repositories/quizSubmission.repository';
import { QuizDocument } from '../models/Quiz';
import { QuizSubmissionDocument } from '../models/QuizSubmission';
import mongoose from 'mongoose';

export class QuizService {
  static async saveQuiz(quizData: Partial<QuizDocument>) {
    try {
      const existingQuiz = await QuizRepository.findOne({ title: quizData.title });
      
      if (existingQuiz) {
        return { message: 'Quiz already exists' };
      }

      const quiz = await QuizRepository.save(quizData);
      return { message: 'Quiz saved successfully', quiz };
    } catch (error) {
      console.error('Error in saveQuiz:', error);
      
      throw error;
    }
  }
  static async saveQuizSubmission(submissionData: Partial<QuizSubmissionDocument>) {
    if (!submissionData.quiz || typeof submissionData.quiz !== 'string') {
        return { message: 'Invalid quiz ID' };
    }

    const quiz: QuizDocument | null = await QuizRepository.findById(submissionData.quiz);

    if (!quiz) {
        return { message: 'Associated quiz not found' };
    }

    const existingSubmission: QuizSubmissionDocument | null = await QuizSubmissionRepository.findOne({
        user_id: submissionData.user_id,
        quiz: submissionData.quiz
    });

    if (existingSubmission) {
        return { message: 'Submission already exists' };
    }

    submissionData.quiz = new mongoose.Types.ObjectId(submissionData.quiz as string);

    const submission: QuizSubmissionDocument = await QuizSubmissionRepository.save(submissionData);
    
    return { message: 'Quiz submission saved successfully', submission };
}


  static async getUserQuizHistory(userId: string) {
    return QuizSubmissionRepository.getUserHistory(userId);
  }
}
