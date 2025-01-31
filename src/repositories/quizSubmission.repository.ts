import { QuizSubmission, QuizSubmissionDocument } from '../models/QuizSubmission';

export class QuizSubmissionRepository {
  // Find a submission by ID
  static async findById(submissionId: string): Promise<QuizSubmissionDocument | null> {
    return QuizSubmission.findById(submissionId);
  }

  // Find a submission by criteria
  static async findOne(criteria: object): Promise<QuizSubmissionDocument | null> {
    return QuizSubmission.findOne(criteria);
  }

  // Get user quiz history
  static async getUserHistory(userId: string, limit: number = 5): Promise<QuizSubmissionDocument[]> {
    return QuizSubmission.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('quiz');
  }

  // Save a new quiz submission
  static async save(submissionData: Partial<QuizSubmissionDocument>): Promise<QuizSubmissionDocument> {
    const submission = new QuizSubmission(submissionData);
    return submission.save();
  }
}
