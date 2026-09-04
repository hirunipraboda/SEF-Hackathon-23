import { Router } from 'express';
import { getSchedules, searchSchedules } from '../controllers/scheduleController.js';

const router = Router();

router.get('/search', searchSchedules);
router.get('/', getSchedules);

export default router;
