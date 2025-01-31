import { PerformanceAnalytics } from '../models/PerformanceAnalytics';
import { QuizSubmission } from '../models/QuizSubmission';

export class PerformanceAnalyticsRepository {
  static async analyzePerformance(userId: string) {
    const analysis = await QuizSubmission.aggregate([
      { $match: { user_id: Number(userId) } },
      { $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
      }},
      { $unwind: '$quizData' },
      // Add preprocessing for percentage string values
      { $addFields: {
        numericAccuracy: {
          $divide: [
            { $convert: {
                input: { $replaceAll: { 
                  input: "$accuracy", 
                  find: "%", 
                  replacement: "" 
                }},
                to: "double",
                onError: 0
            }},
            100
          ]
        },
        numericDuration: {
          $convert: {
            input: { $replaceAll: { 
              input: "$duration", 
              find: "s", 
              replacement: "" 
            }},
            to: "double",
            onError: 0
          }
        }
      }},
      { $group: {
        _id: {
          topic: '$quizData.topic',
          difficulty: '$quizData.difficulty_level'
        },
        accuracy: { $avg: '$numericAccuracy' },
        attempts: { $sum: 1 },
        totalTime: { $sum: '$numericDuration' },
        lastAttempted: { $max: '$submitted_at' },
        totalQuestions: { $sum: '$total_questions' },
        correctAnswers: { $sum: '$correct_answers' }
      }},
      // Convert accuracy back to percentage for consistency
      { $addFields: {
        accuracy: { $multiply: ['$accuracy', 100] }
      }}
    ]);

    return analysis;
  }

  static async saveAnalytics(userId: string, analytics: any) {
    return PerformanceAnalytics.findOneAndUpdate(
      { userId: Number(userId) },
      analytics,
      { upsert: true, new: true }
    );
  }
}

