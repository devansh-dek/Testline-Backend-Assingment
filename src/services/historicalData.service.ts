import { HistoricalDataRepository } from '../repositories/historicalData.repository';
import { INEETHistoricalData } from '../models/NEETRankData';

export class HistoricalDataService {
  // Create new historical data entry
  public static async createHistoricalData(data: INEETHistoricalData): Promise<INEETHistoricalData> {
    try {
      const savedData = await HistoricalDataRepository.saveHistoricalData(data);
      return savedData;
    } catch (error) {
      throw new Error('Error saving historical data: ');
    }
  }
}
