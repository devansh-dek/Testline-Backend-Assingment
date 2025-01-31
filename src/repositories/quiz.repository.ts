import { Quiz, QuizDocument } from '../models/Quiz';
import mongoose from 'mongoose';
export class QuizRepository {
  static async findById(quizId: string): Promise<QuizDocument | null> {
    return Quiz.findById(quizId).exec(); // Ensuring correct return type
  }

  static async findOne(criteria: object): Promise<QuizDocument | null> {
    try {
      const result = await Quiz.findOne(criteria)
        .maxTimeMS(20000) // Set specific timeout for this query
        .lean() // Use lean for better performance
        .exec();
      return result;
    } catch (error) {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return null;
      }
      throw error;
    }
  }

  static async save(quizData: Partial<QuizDocument>): Promise<QuizDocument> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const quiz = new Quiz(quizData);
      await quiz.save({ session });
      await session.commitTransaction();
      return quiz;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
