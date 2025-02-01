import mongoose, { Schema, Document } from 'mongoose';
import { College } from '../interfaces/neet.interface';

const collegeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    lastYearCutoff: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Government', 'Private'],
        required: true
    }
}, {
    timestamps: true
});

export const CollegeModel = mongoose.model<College & Document>('College', collegeSchema);

