import { QuizRepository } from '../repositories/quiz.repository';
import { QuizSubmissionRepository } from '../repositories/quizSubmission.repository';
import { QuizDocument } from '../models/Quiz';
import { QuizSubmissionDocument } from '../models/QuizSubmission';
import mongoose from 'mongoose';

export class QuizService {
  // Save a new quiz
  static async saveQuiz(quizData: Partial<QuizDocument>) {
    try {
      // Check if a quiz with the same title already exists
      const existingQuiz = await QuizRepository.findOne({ title: quizData.title });
      
      if (existingQuiz) {
        return { message: 'Quiz already exists' };
      }

      // Save the new quiz
      const quiz = await QuizRepository.save(quizData);
      return { message: 'Quiz saved successfully', quiz };
    } catch (error) {
      console.error('Error in saveQuiz:', error);
      throw new Error('Failed to save quiz. Please try again later.');
    }
  }

  // Save a quiz submission
  static async saveQuizSubmission(submissionData: Partial<QuizSubmissionDocument>) {
    try {
      console.log(typeof submissionData.quiz !== 'string')
      // Validate the quiz ID
      if (!submissionData.quiz || typeof submissionData.quiz !== 'string') {
        return { message: 'Invalid quiz ID' };
      }

      // Find the quiz to check if it exists
      const quiz: QuizDocument | null = await QuizRepository.findById(submissionData.quiz);

      if (!quiz) {
        return { message: 'Associated quiz not found' };
      }

      // Check if the user has already submitted the quiz
      const existingSubmission: QuizSubmissionDocument | null = await QuizSubmissionRepository.findOne({
        user_id: submissionData.user_id,
        quiz: submissionData.quiz
      });

      if (existingSubmission) {
        return { message: 'Submission already exists' };
      }

      // Save the new quiz submission
      submissionData.quiz = new mongoose.Types.ObjectId(submissionData.quiz as string);

      const submission: QuizSubmissionDocument = await QuizSubmissionRepository.save(submissionData);
      
      return { message: 'Quiz submission saved successfully', submission };
    } catch (error) {
      console.error('Error in saveQuizSubmission:', error);
      throw new Error('Failed to save quiz submission. Please try again later.');
    }
  }

  // Get user's quiz history
  static async getUserQuizHistory(userId: string) {
    try {
      const history = await QuizSubmissionRepository.getUserHistory(userId);
      return history;
    } catch (error) {
      console.error('Error in getUserQuizHistory:', error);
      throw new Error('Failed to fetch quiz history. Please try again later.');
    }
  }
}
