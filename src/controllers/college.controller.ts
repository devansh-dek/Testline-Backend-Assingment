import { Request, Response } from 'express';
import { CollegeService } from '../services/college.service';
import { AuthorizationError } from '../utils/error';

export class CollegeController {
    private collegeService: CollegeService;

    constructor() {
        this.collegeService = new CollegeService();
    }

    addCollege = async (req: Request, res: Response): Promise<void> => {
        try {
            // Check if user is admin
          

            const college = await this.collegeService.addCollege(req.body);
            
            res.status(201).json({
                success: true,
                data: { college }
            });
        } catch (error: any) {
            res.status(error.statusCode || 400).json({
                success: false,
                error: error.message
            });
        }
    };

    addMultipleColleges = async (req: Request, res: Response): Promise<void> => {
        try {
            // Check if user is admin
          

            const colleges = await this.collegeService.addMultipleColleges(req.body.colleges);
            
            res.status(201).json({
                success: true,
                data: { colleges }
            });
        } catch (error: any) {
            res.status(error.statusCode || 400).json({
                success: false,
                error: error.message
            });
        }
    };
}

