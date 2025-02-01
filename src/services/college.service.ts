import { College } from '../interfaces/neet.interface';
import { CollegeRepository } from '../repositories/college.repository';
import { ValidationError } from '../utils/error';

export class CollegeService {
    private repository: CollegeRepository;

    constructor() {
        this.repository = new CollegeRepository();
    }

    private validateCollege(college: Omit<College, '_id'>): void {
        if (!college.name || college.name.trim().length < 3) {
            throw new ValidationError('College name must be at least 3 characters long');
        }
        if (!college.city || college.city.trim().length < 2) {
            throw new ValidationError('City name must be at least 2 characters long');
        }
        if (!college.state || college.state.trim().length < 2) {
            throw new ValidationError('State name must be at least 2 characters long');
        }
        if (college.lastYearCutoff < 1 || college.lastYearCutoff > 1000000) {
            throw new ValidationError('Invalid cutoff rank');
        }
        if (college.totalSeats < 1 || college.totalSeats > 1000) {
            throw new ValidationError('Total seats must be between 1 and 1000');
        }
        if (!['Government', 'Private'].includes(college.category)) {
            throw new ValidationError('Invalid college category');
        }
    }

    async addCollege(collegeData: Omit<College, '_id'>): Promise<College> {
        this.validateCollege(collegeData);
        return await this.repository.create(collegeData);
    }

    async addMultipleColleges(colleges: Omit<College, '_id'>[]): Promise<College[]> {
        colleges.forEach(college => this.validateCollege(college));
        return await this.repository.createMany(colleges);
    }
}

