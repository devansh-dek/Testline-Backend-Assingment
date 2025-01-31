import { PerformanceAnalyticsRepository } from "../repositories/performanceAnalytics.repository";

export class PerformanceAnalyticsService {
    static async generateAnalytics(userId: string) {
      try {
        const rawAnalysis = await PerformanceAnalyticsRepository.analyzePerformance(userId);
        
        const topicWisePerformance = new Map();
        const difficultyLevelPerformance = new Map();
  
        rawAnalysis.forEach(item => {
          // Process topic-wise performance
          if (item._id.topic) {
            topicWisePerformance.set(item._id.topic, {
              accuracy: Number(item.accuracy.toFixed(2)),
              totalAttempts: item.attempts,
              timeSpent: Number(item.totalTime.toFixed(2)),
              lastAttempted: new Date(item.lastAttempted),
              totalQuestions: item.totalQuestions,
              correctAnswers: item.correctAnswers
            });
          }
  
          // Process difficulty-wise performance
          if (item._id.difficulty) {
            difficultyLevelPerformance.set(item._id.difficulty, {
              accuracy: Number(item.accuracy.toFixed(2)),
              totalAttempts: item.attempts,
              averageTime: Number((item.totalTime / item.attempts).toFixed(2)),
              totalQuestions: item.totalQuestions,
              correctAnswers: item.correctAnswers
            });
          }
        });
  
        const analytics = await PerformanceAnalyticsRepository.saveAnalytics(userId, {
          userId: Number(userId),
          topicWisePerformance,
          difficultyLevelPerformance
        });
  
        return analytics;
      } catch (error) {
        console.error('Error in generateAnalytics:', error);
        throw error;
      }
    }
  }
  