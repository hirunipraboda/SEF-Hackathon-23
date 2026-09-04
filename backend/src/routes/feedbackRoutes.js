import { Router } from 'express';
import {
  getFeedback,
  getFeedbackByTrain,
  getFeedbackSummary,
  createFeedback,
} from '../controllers/feedbackController.js';

const router = Router();

router.get('/', getFeedback);
router.post('/', createFeedback);
router.get('/train/:trainId', getFeedbackByTrain);
router.get('/summary/:trainId', getFeedbackSummary);

export default router;
