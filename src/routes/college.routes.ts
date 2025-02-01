import { Router } from 'express';
import { CollegeController } from '../controllers/college.controller';

const router = Router();
const collegeController = new CollegeController();

router.post('/',  collegeController.addCollege);
router.post('/bulk',  collegeController.addMultipleColleges);

export default router;
