import { College } from '../interfaces/neet.interface';
import { CollegeModel } from '../models/college.model';
import { ValidationError } from '../utils/error';

export class CollegeRepository {
    async create(collegeData: Omit<College, '_id'>): Promise<College> {
        try {
            const college = new CollegeModel(collegeData);
            return await college.save();
        } catch (error: any) {
            if (error.code === 11000) { // MongoDB duplicate key error
                throw new ValidationError('College with this name already exists');
            }
            throw error;
        }
    }

    async createMany(colleges: Omit<College, '_id'>[]): Promise<College[]> {
        try {
            return await CollegeModel.insertMany(colleges, { ordered: false });
        } catch (error: any) {
            if (error.writeErrors) {
                throw new ValidationError('Some colleges could not be inserted - duplicate names found');
            }
            throw error;
        }
    }
}

