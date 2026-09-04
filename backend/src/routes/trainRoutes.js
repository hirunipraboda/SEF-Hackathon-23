import { Router } from 'express';
import { getTrains, getTrainById } from '../controllers/trainController.js';

const router = Router();

router.get('/', getTrains);
router.get('/:id', getTrainById);

export default router;
