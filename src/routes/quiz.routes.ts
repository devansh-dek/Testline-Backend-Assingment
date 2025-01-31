import { Router } from 'express';
import QuizController from '../controllers/quiz.controller';

const router = Router();
const quizControllerInstance = new QuizController();

router.post('/quiz', quizControllerInstance.saveQuiz);
router.post('/submission', quizControllerInstance.saveQuizSubmission);
router.get('/history/:userId', quizControllerInstance.getUserQuizHistory);

export default router;