import { Router } from 'express';
import trainRoutes from './trainRoutes.js';
import stationRoutes from './stationRoutes.js';
import routeRoutes from './routeRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';
import fareRoutes from './fareRoutes.js';
import issueRoutes from './issueRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import trackingRoutes from './trackingRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const apiRouter = Router();

apiRouter.use('/trains', trainRoutes);
apiRouter.use('/stations', stationRoutes);
apiRouter.use('/routes', routeRoutes);
apiRouter.use('/schedules', scheduleRoutes);
apiRouter.use('/fares', fareRoutes);
apiRouter.use('/issues', issueRoutes);
apiRouter.use('/feedback', feedbackRoutes);
apiRouter.use('/tracking', trackingRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/payments', paymentRoutes);

export default apiRouter;
