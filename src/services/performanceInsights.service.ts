import { PerformanceInsightsRepository } from '../repositories/performanceInsights.repository';
import { 
  WeakArea, 
  ImprovementTrend, 
  PerformanceGap, 
  TopicPerformance,
  RawPerformanceData 
} from '../types/performance.types';

export class PerformanceInsightsService {
  private static readonly WEAK_PERFORMANCE_THRESHOLD = 70;
  private static readonly TARGET_ACCURACY = 75;
  private static readonly DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

  static async generateInsights(userId: string) {
    try {
      const [weakAreasData, trendsData] = await Promise.all([
        PerformanceInsightsRepository.findWeakAreas(userId),
        PerformanceInsightsRepository.calculateImprovementTrends(userId)
      ]);

      const weakAreas = this.processWeakAreas(weakAreasData);
      const improvementTrends = this.processImprovementTrends(trendsData);
      const performanceGaps = this.processPerformanceGaps(weakAreasData);

      const insights = await PerformanceInsightsRepository.saveInsights(userId, {
        userId: Number(userId),
        weakAreas,
        improvementTrends,
        performanceGaps,
        lastUpdated: new Date()
      });

      return this.formatInsightsResponse(insights);
    } catch (error) {
      console.error('Error in generateInsights:', error);
      throw new Error('Failed to generate performance insights');
    }
  }

  private static processWeakAreas(weakAreasData: RawPerformanceData[]): WeakArea[] {
    return weakAreasData
      .filter(area => area.accuracy < this.WEAK_PERFORMANCE_THRESHOLD)
      .map(area => ({
        topic: area._id.topic,
        accuracy: this.formatPercentage(area.accuracy),
        difficulty: area._id.difficulty || 'unknown', // Ensure difficulty is present
        recommendedActions: this.generateRecommendations(
          area._id.topic, 
          area.accuracy, 
          area._id.difficulty || 'medium' // Default to 'medium' if missing
        )
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }
    static formatPercentage(accuracy: number): any {
        throw new Error('Method not implemented.');
    }
  
  private static calculateTrends(topicPerformance: TopicPerformance[]): ImprovementTrend[] {
    return topicPerformance
      .filter(tp => tp.weekData.length >= 2)
      .map(tp => {
        const weekData = tp.weekData.sort((a, b) => a.weekNumber - b.weekNumber);
        const previousAccuracy = weekData[0].accuracy;
        const currentAccuracy = weekData[weekData.length - 1].accuracy;
        const trend = ((currentAccuracy - previousAccuracy) / previousAccuracy) * 100;
  
        return {
          topic: tp.topic,
          previousAccuracy: this.formatPercentage(previousAccuracy),
          currentAccuracy: this.formatPercentage(currentAccuracy),
          trend: Number(trend.toFixed(2)),
          period: '30 days'
        };
      });
  }
  

  private static processImprovementTrends(trendsData: any[]): ImprovementTrend[] {
    const topicPerformance = this.groupPerformanceByTopic(trendsData);
    return this.calculateTrends(topicPerformance);
  }
  private static groupPerformanceByTopic(trendsData: any[]): TopicPerformance[] {
    const topicMap = new Map<string, TopicPerformance>();
  
    trendsData.forEach(item => {
      const topic = item._id.topic;
      const weekData = {
        weekNumber: item._id.week,
        accuracy: item.accuracy
      };
  
      if (!topicMap.has(topic)) {
        topicMap.set(topic, { topic, weekData: [] });
      }
  
      topicMap.get(topic)?.weekData.push(weekData);
    });
  
    return Array.from(topicMap.values());
  }
  

  private static processPerformanceGaps(performanceData: RawPerformanceData[]): PerformanceGap[] {
    return performanceData.map(data => {
      const userAccuracy = this.parseAccuracy(data.accuracy);
      return {
        topic: data.topic,
        userAccuracy,
        averageAccuracy: this.TARGET_ACCURACY,
        gap: Math.max(0, this.TARGET_ACCURACY - userAccuracy)
      };
    });
  }

  private static parseAccuracy(accuracy: string | number): number {
    if (typeof accuracy === 'string') {
      const match = accuracy.match(/\d+/);
      return match ? Number(match[0]) : 0;
    }
    return typeof accuracy === 'number' ? accuracy : 0;
  }

  private static generateRecommendations(topic: string, accuracy: number, p0: string): string[] {
    if (accuracy < 50) {
      return [`Review basic concepts in ${topic}`, `Practice fundamentals in ${topic}`];
    } else if (accuracy < 70) {
      return [`Increase practice frequency for ${topic}`, `Try mixed difficulty level questions`];
    } else {
      return [`Challenge yourself with advanced ${topic} problems`];
    }
  }

  private static formatInsightsResponse(insights: any) {
    return {
      weakAreas: insights.weakAreas,
      improvementTrends: insights.improvementTrends,
      performanceGaps: insights.performanceGaps,
      summary: {
        totalWeakAreas: insights.weakAreas.length,
        averageImprovement: this.calculateAverageImprovement(insights.improvementTrends),
        largestGap: this.findLargestGap(insights.performanceGaps),
        lastUpdated: insights.lastUpdated
      }
    };
  }

  private static calculateAverageImprovement(trends: ImprovementTrend[]): number {
    if (trends.length === 0) return 0;
    const sum = trends.reduce((acc, trend) => acc + trend.trend, 0);
    return Number((sum / trends.length).toFixed(2));
  }

  private static findLargestGap(gaps: PerformanceGap[]): PerformanceGap | null {
    if (gaps.length === 0) return null;
    return gaps.reduce((max, current) => (current.gap > max.gap ? current : max));
  }
}
