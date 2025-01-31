import { QuizSubmission, QuizSubmissionDocument } from '../models/QuizSubmission';
import mongoose from 'mongoose';
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
  static async analyzeStudentPerformance(userId: string): Promise<any> {
    const debugData = await QuizSubmission.find({ user_id: Number(userId) })
  .select("response_map quiz total_questions")
  .populate("quiz");
console.log(debugData);

return QuizSubmission.aggregate([
  { $match: { user_id: Number(userId) } },

  // Convert response_map to an array
  { $project: { responseArray: { $objectToArray: "$response_map" }, correctAnswers: "$correct_answers" } },
  { $unwind: "$responseArray" },

  // Compare submitted answers with correct ones
  { $project: {
      topic: "$quiz.topic",
      difficulty: "$quiz.difficulty_level",
      isCorrect: { $eq: ["$responseArray.v", { $getField: { field: "$responseArray.k", input: "$correctAnswers" } }] }
  }},

  // Aggregate accuracy
  { $group: {
      _id: { topic: "$topic", difficulty: "$difficulty" },
      totalAttempts: { $sum: 1 },
      correctAnswers: { $sum: { $cond: ["$isCorrect", 1, 0] } }
  }},

  { $project: {
      topic: "$_id.topic",
      difficulty: "$_id.difficulty",
      accuracy: { $cond: [{ $eq: ["$totalAttempts", 0] }, 0, { $divide: ["$correctAnswers", "$totalAttempts"] }] },
      attempts: "$totalAttempts"
  }}
]);

  }
  

}
