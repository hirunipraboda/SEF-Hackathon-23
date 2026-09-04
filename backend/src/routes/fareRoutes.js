import { Router } from 'express';
import { getFares, calculateFare } from '../controllers/fareController.js';

const router = Router();

router.get('/', getFares);
router.post('/calculate', calculateFare);

export default router;
