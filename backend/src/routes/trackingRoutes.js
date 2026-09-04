import { Router } from 'express';
import {
  getTrackedTrains,
  getTrainTracking,
  getTrackingRoutes,
  getTrackingStations,
  getTrackingStatus,
} from '../controllers/trackingController.js';

const router = Router();

router.get('/trains', getTrackedTrains);
router.get('/trains/:id', getTrainTracking);
router.get('/routes', getTrackingRoutes);
router.get('/routes/all', getTrackingRoutes);
router.get('/routes/:id', getTrackingRoutes);
router.get('/stations', getTrackingStations);
router.get('/status', getTrackingStatus);

export default router;
