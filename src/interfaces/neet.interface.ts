export interface NEETScore {
    physics: number;
    chemistry: number;
    biology: number;
}

export interface College {
    _id: string;
    name: string;
    city: string;
    state: string;
    lastYearCutoff: number;
    totalSeats: number;
    category: 'Government' | 'Private';
}

export interface PredictionResult {
    predictedRank: number;
    predictedColleges: Array<{
        college: College;
        admissionProbability: number;
    }>;
}

