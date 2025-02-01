// performanceInsights.repository.ts
import { PerformanceInsights } from '../models/PerformanceInsights';
import { QuizSubmission } from '../models/QuizSubmission';
import mongoose from 'mongoose';

export class PerformanceInsightsRepository {
  static async findWeakAreas(userId: string) {
    const data = await QuizSubmission.aggregate([
        { $match: { user_id: Number(userId) } },
        { $lookup: { from: 'quizzes', localField: 'quiz', foreignField: '_id', as: 'quizData' } },
        { $unwind: '$quizData' },
        { $project: { topic: '$quizData.topic', accuracy: 1, attempts: 1 } }
      ]);
      console.log('Raw Weak Areas Data:', data);
      
      return QuizSubmission.aggregate([
        { $match: { user_id: Number(userId) } },
        { $lookup: { from: 'quizzes', localField: 'quiz', foreignField: '_id', as: 'quizData' } },
        { $unwind: '$quizData' },
        { $addFields: {
            numericAccuracy: {
              $convert: {
                input: { $trim: { input: { $rtrim: { input: "$accuracy", chars: "%" } } } },
                to: "double",
                onError: 0
              }
            }
          }
        },
        { $project: { _id: 1, topic: "$quizData.topic", accuracy: 1, numericAccuracy: 1 } }
      ]);
      
  }

  static async calculateImprovementTrends(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return QuizSubmission.aggregate([
      { $match: { 
        user_id: Number(userId),
        createdAt: { $gte: thirtyDaysAgo }
      }},
      { $lookup: {
        from: 'quizzes',
        localField: 'quiz',
        foreignField: '_id',
        as: 'quizData'
      }},
      { $unwind: '$quizData' },
      { $addFields: {
        numericAccuracy: {
          $convert: {
            input: { $trim: { input: { $rtrim: { input: "$accuracy", chars: "%" } } } },
            to: "double",
            onError: 0
          }
        },
        weekNumber: { $week: '$createdAt' }
      }},
      { $group: {
        _id: {
          topic: '$quizData.topic',
          week: '$weekNumber'
        },
        accuracy: { $avg: '$numericAccuracy' },
        attempts: { $sum: 1 }
      }},
      { $sort: { '_id.week': 1 } }
    ]);
  }

  static async calculatePerformanceGaps(userId: string) {
    const [userPerformance, averagePerformance] = await Promise.all([
      // User's performance
      QuizSubmission.aggregate([
        { $match: { user_id: Number(userId) } },
        { $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }},
        { $unwind: '$quizData' },
        { $addFields: {
          numericAccuracy: {
            $convert: {
              input: { $trim: { input: { $rtrim: { input: "$accuracy", chars: "%" } } } },
              to: "double",
              onError: 0
            }
          }
        }},
        { $group: {
          _id: '$quizData.topic',
          userAccuracy: { $avg: '$numericAccuracy' }
        }}
      ]),
      // Average performance of all users
      QuizSubmission.aggregate([
        { $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }},
        { $unwind: '$quizData' },
        { $addFields: {
          numericAccuracy: {
            $convert: {
              input: { $trim: { input: { $rtrim: { input: "$accuracy", chars: "%" } } } },
              to: "double",
              onError: 0
            }
          }
        }},
        { $group: {
          _id: '$quizData.topic',
          averageAccuracy: { $avg: '$numericAccuracy' }
        }}
      ])
    ]);

    return { userPerformance, averagePerformance };
  }

  static async saveInsights(userId: string, insights: any) {
    return PerformanceInsights.findOneAndUpdate(
      { userId: Number(userId) },
      insights,
      { upsert: true, new: true }
    );
  }
}