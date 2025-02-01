import { CollegeModel } from '../models/college.model';
import { College } from '../interfaces/neet.interface';

export class NEETPredictionRepository {
    async findCollegesByRankRange(minRank: number, maxRank: number): Promise<College[]> {
        return await CollegeModel.find({
            lastYearCutoff: {
                $gte: minRank - 5000, // Buffer for lower range
                $lte: maxRank + 2000  // Buffer for upper range
            }
        }).sort({ lastYearCutoff: 1 });
    }

    async findAllColleges(): Promise<College[]> {
        return await CollegeModel.find().sort({ lastYearCutoff: 1 });
    }
}
