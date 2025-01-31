import { QuizService } from '../services/quiz.service';
import { RequestHandler } from 'express';

class QuizController {
  public saveQuiz: RequestHandler = async (req, res) => {
    try {
      const result = await QuizService.saveQuiz(req.body);
      if (!result.quiz) {
         res.status(409).json({ message: result.message });
      }
      else
       res.status(201).json(result);
    } catch (error) {
      console.log("error in ",error);
      res.status(500).json({ message: 'Error saving quiz', error });
    }
  };

  public saveQuizSubmission: RequestHandler = async (req, res) => {
    try {
      const result = await QuizService.saveQuizSubmission(req.body);
      if (!result.submission) {
         res.status(409).json({ message: result.message });
      }
      else
       res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error saving quiz submission', error });
    }
  };

  public getUserQuizHistory: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await QuizService.getUserQuizHistory(userId);
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching quiz history', error });
    }
  };
}

export default QuizController;