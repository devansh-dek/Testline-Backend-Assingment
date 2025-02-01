import { NEETHistoricalData } from '../models/NEETRankData';
import { INEETHistoricalData } from '../models/NEETRankData';

export class HistoricalDataRepository {
  // Save historical data into the database
  public static async saveHistoricalData(data: INEETHistoricalData): Promise<INEETHistoricalData> {
    try {
      const historicalData = new NEETHistoricalData(data);
      return await historicalData.save();
    } catch (error) {
      throw new Error('Error saving historical data to the database: ');
    }
  }
}
