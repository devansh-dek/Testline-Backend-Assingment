import { Request, Response } from 'express';
import { NEETPredictionService } from '../services/neetPrediction.service';
import { NEETScore } from '../interfaces/neet.interface';

export class NEETPredictionController {
    private predictionService: NEETPredictionService;

    constructor() {
        this.predictionService = new NEETPredictionService();
    }

    predictColleges = async (req: Request, res: Response): Promise<void> => {
        try {
            const scores: NEETScore = {
                physics: Number(req.body.physics),
                chemistry: Number(req.body.chemistry),
                biology: Number(req.body.biology)
            };

            const prediction = await this.predictionService.predictColleges(scores);

            res.status(200).json({
                success: true,
                data: prediction
            });
        } catch (error: any) {
            res.status(error.statusCode || 400).json({
                success: false,
                error: error.message
            });
        }
    };
}

