import { Router } from 'express';
import { getStations, getStationById } from '../controllers/stationController.js';

const router = Router();

router.get('/', getStations);
router.get('/:id', getStationById);

export default router;
