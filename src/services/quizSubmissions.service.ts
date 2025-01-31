import { QuizSubmissionRepository } from '../repositories/quizSubmission.repository';

export class QuizSubmissionService {
  // Analyze performance
  static async analyzePerformance(userId: string): Promise<any> {
    try {
      return await QuizSubmissionRepository.analyzeStudentPerformance(userId);
    } catch (error) {
      throw new Error('Error analyzing student performance');
    }
  }
}
