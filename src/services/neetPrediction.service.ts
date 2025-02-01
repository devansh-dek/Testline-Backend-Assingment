import { NEETScore, PredictionResult, College } from '../interfaces/neet.interface';
import { NEETPredictionRepository } from '../repositories/neetPrediction.repository';
import { ValidationError } from '../utils/error';


export class NEETPredictionService {
    private repository: NEETPredictionRepository;

    constructor() {
        this.repository = new NEETPredictionRepository();
    }

    private validateScores(scores: NEETScore): void {
        const maxScore = 180;
        if (scores.physics < 0 || scores.physics > maxScore ||
            scores.chemistry < 0 || scores.chemistry > maxScore ||
            scores.biology < 0 || scores.biology > maxScore) {
            throw new ValidationError('Invalid scores. Scores must be between 0 and 180');
        }
    }

    private calculateNEETScore(scores: NEETScore): number {
        return scores.physics + scores.chemistry + scores.biology;
    }

    private predictRank(totalScore: number): number {
        // This is a simplified rank prediction algorithm
        // In a real application, this would use more sophisticated statistical models
        const maxScore = 720;
        const estimatedTopScore = 715;
        const totalApplicants = 2000000; // Approximate number of NEET applicants

        const percentile = (totalScore / estimatedTopScore) * 100;
        return Math.round((100 - percentile) * (totalApplicants / 100));
    }

    private calculateAdmissionProbability(predictedRank: number, collegeCutoff: number): number {
        const rankDifference = collegeCutoff - predictedRank;
        if (rankDifference > 5000) return 0.95;
        if (rankDifference > 2000) return 0.8;
        if (rankDifference > 0) return 0.6;
        if (rankDifference > -2000) return 0.3;
        return 0.1;
    }

    async predictColleges(scores: NEETScore): Promise<PredictionResult> {
        this.validateScores(scores);

        const totalScore = this.calculateNEETScore(scores);
        const predictedRank = this.predictRank(totalScore);

        const eligibleColleges = await this.repository.findCollegesByRankRange(
            predictedRank - 5000,
            predictedRank + 10000
        );

        const predictedColleges = eligibleColleges.map(college => ({
            college,
            admissionProbability: this.calculateAdmissionProbability(predictedRank, college.lastYearCutoff)
        })).filter(prediction => prediction.admissionProbability > 0.1)
          .sort((a, b) => b.admissionProbability - a.admissionProbability);

        return {
            predictedRank,
            predictedColleges: predictedColleges.slice(0, 10) // Return top 10 most likely colleges
        };
    }
}

